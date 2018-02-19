import * as React from "react";
import * as ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router";
import {
    ItemCardModel,
    Resource,
    getResourceContent,
    AboutItemModel,
    ItemModel,
    ItemsSearchFilterModel,
    BasicFilterCategoryModel,
    ItemSearch,
    SearchUrl,
    Filter,
    AdvancedFilterCategoryModel,
    SearchAPIParamsModel,
    ItemTableContainer,
    FilterCategoryModel,
    FilterContainer,
    FilterLink,
    GradeLevels,
    CombinedFilter,
    ItemsSearchModel
} from "@osu-cass/sb-components";
import {
    pdfURLPost,
    pdfBodyPost,
    getBasicFilterCategories,
    getAdvancedFilterCategories,
    getItemSearchModel
} from "./ScoreGuideModels";

export interface Props extends RouteComponentProps<{}> {
    itemsSearchFilterClient: () => Promise<ItemsSearchFilterModel>;
    aboutItemClient: (params: ItemModel) => Promise<AboutItemModel>;
    itemCardClient: () => Promise<ItemCardModel[]>;
}

export interface State {
    item: Resource<AboutItemModel>;
    allItems: Resource<ItemCardModel[]>;
    itemsSearchModel?: ItemsSearchModel;
    basicFilter: BasicFilterCategoryModel[];
    advancedFilter: AdvancedFilterCategoryModel[];
    visibleItems: ItemCardModel[];
    selectedItems: ItemModel[];
    searchAPIParams: SearchAPIParamsModel;
    nonSelectedFilters: string[];
}

export class ScoringGuidePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemsSearchModel: undefined,
            allItems: { kind: "loading" },
            basicFilter: [],
            advancedFilter: [],
            item: { kind: "none" },
            visibleItems: [],
            selectedItems: [],
            searchAPIParams: SearchUrl.decodeSearch(this.props.location.search),
            nonSelectedFilters: []
        };
    }

    componentDidMount() {
        document.title = "Score Guide - Smarter Balanced";
        Promise.all([
            this.props.itemCardClient(),
            this.props.itemsSearchFilterClient()
        ])
            .then(([cards, filterModel]) =>
                this.onLoadSuccess(cards, filterModel)
            )
            .catch(err => this.onLoadFailure(err));
    }

    onLoadSuccess = (
        cards: ItemCardModel[],
        filterModel: ItemsSearchFilterModel
    ) => {
        const { searchAPIParams } = this.state;
        const searchModel = getItemSearchModel(filterModel);
        let advancedFilter = getAdvancedFilterCategories(
            filterModel,
            searchAPIParams
        );
        advancedFilter = Filter.hideFiltersBasedOnSearchParams(
            advancedFilter,
            searchAPIParams
        );
        this.setState({
            allItems: { kind: "success", content: cards },
            itemsSearchModel: searchModel,
            basicFilter: getBasicFilterCategories(filterModel, searchAPIParams),
            advancedFilter: Filter.getUpdatedSearchFilters(
                searchModel,
                advancedFilter,
                searchAPIParams
            ),
            visibleItems: ItemSearch.filterItemCards(cards, searchAPIParams)
        });
    };

    onLoadFailure(err: Error) {
        console.error(err);
        this.setState({
            allItems: { kind: "failure" }
        });
    }

    getAboutItem = (item: ItemModel) => {
        this.props
            .aboutItemClient(item)
            .then(data => this.onAboutItemSuccess(data))
            .catch(err => this.onAboutItemError(err));
    };

    onAboutItemSuccess = (data: AboutItemModel) => {
        const item: Resource<AboutItemModel> = {
            kind: "success",
            content: data
        };
        this.setState({ item });
    };

    onAboutItemError = (err: Error) => {
        console.error(err);
        this.setState({
            item: { kind: "failure" }
        });
    };

    handleItemSelection = (item: ItemCardModel) => {
        const { selectedItems, visibleItems } = this.state;
        const { itemKey, bankKey } = item;
        const selectedItem: ItemModel = { itemKey, bankKey };
        const idx = selectedItems.findIndex(
            value =>
                value.itemKey === selectedItem.itemKey &&
                value.bankKey === selectedItem.bankKey
        );
        const itemIdx = visibleItems.findIndex(value => value === item);
        if (idx > -1) {
            selectedItems.splice(idx, 1);
        } else {
            selectedItems.push(selectedItem);
        }

        const newVisibleItems = visibleItems.slice();
        newVisibleItems[itemIdx] = {
            ...visibleItems[itemIdx],
            selected: !visibleItems[itemIdx].selected
        };
        this.setState({
            selectedItems,
            visibleItems: newVisibleItems
        });
    };

    handleRowSelection = (item: ItemModel, reset: boolean) => {
        if (reset === false) {
            this.getAboutItem(item);
        } else {
            const item: Resource<AboutItemModel> = { kind: "none" };
            this.setState({ item });
        }
    };

    onFilterApplied = (
        searchParams: SearchAPIParamsModel,
        basic: BasicFilterCategoryModel[],
        advanced: AdvancedFilterCategoryModel[]
    ) => {
        const search = SearchUrl.encodeQuery(searchParams);
        const location = { ...this.props.history.location, search };
        this.props.history.replace(location);

        const allItems = getResourceContent(this.state.allItems);

        const newVisibleItems = ItemSearch.filterItemCards(
            allItems || [],
            searchParams
        );

        this.setState({
            basicFilter: basic,
            advancedFilter: advanced,
            searchAPIParams: searchParams,
            visibleItems: newVisibleItems
        });
    };

    printItems(searchModel: SearchAPIParamsModel): void {
        const { subjects, gradeLevels, performanceOnly, catOnly } = searchModel;
        const nonSelectedFilters: string[] = [];
        if (!subjects || subjects.length <= 0) {
            nonSelectedFilters.push("subject");
        }
        if (!gradeLevels || gradeLevels.valueOf() === GradeLevels.NA) {
            nonSelectedFilters.push("grade level");
        }
        if (!performanceOnly && !catOnly) {
            nonSelectedFilters.push("tech type");
        }
        if (nonSelectedFilters.length > 0) {
            this.setState({ nonSelectedFilters });
        } else {
            if (this.state.selectedItems.length > 0) {
                pdfBodyPost(this.state.selectedItems);
            } else {
                pdfURLPost(SearchUrl.encodeQuery(searchModel));
            }
        }
    }

    renderErrorPrompt(): JSX.Element | undefined {
        const { nonSelectedFilters } = this.state;
        let content;
        if (nonSelectedFilters.length > 0) {
            let filterPrompt = "Please select a ";
            nonSelectedFilters.forEach((fil, idx) => {
                if (
                    idx === 2 ||
                    (nonSelectedFilters.length === 2 && idx === 1)
                ) {
                    filterPrompt = `${filterPrompt} and ${fil}.`;
                } else if (nonSelectedFilters.length === 1 && idx === 0) {
                    filterPrompt = `${filterPrompt} ${fil}.`;
                } else {
                    filterPrompt = `${filterPrompt} ${fil},`;
                }
            });
            content = <div>{filterPrompt}</div>;
        }

        return content;
    }

    renderFilterComponent(): JSX.Element {
        const {
            basicFilter,
            advancedFilter,
            nonSelectedFilters,
            searchAPIParams
        } = this.state;

        return (
            <div className="search-controls">
                <button
                    className="btn btn-blue btn-lg"
                    type="button"
                    onClick={() => this.printItems(searchAPIParams)}
                >
                    Print Items
                </button>
                {this.renderErrorPrompt()}
                <CombinedFilter
                    filterId="sb-filter-id"
                    basicFilter={basicFilter}
                    advancedFilter={advancedFilter}
                    onFilterUpdated={this.onFilterApplied}
                    searchModel={this.state.itemsSearchModel}
                    searchAPI={this.state.searchAPIParams}
                />
                {this.renderTableComponent()}
            </div>
        );
    }

    renderTableComponent(): JSX.Element {
        let content = (
            <div className="placeholder-text" role="Note">
                No items matched the specified search.
            </div>
        );
        if (this.state.visibleItems.length > 0) {
            content = (
                <ItemTableContainer
                    onRowSelection={this.handleRowSelection}
                    onItemSelection={this.handleItemSelection}
                    itemCards={this.state.visibleItems}
                    item={this.state.item}
                    isLinkTable={false}
                />
            );
        } else if (this.state.allItems.kind === "failure") {
            content = (
                <div className="placeholder-text" role="alert">
                    An error occurred. Please try again later.
                </div>
            );
        }

        return content;
    }

    render() {
        const allItems = getResourceContent(this.state.allItems);
        let content = <div>Search failed</div>;
        if (allItems) {
            content = (
                <div className="container search-page">
                    {this.renderFilterComponent()}
                    <FilterLink filterId="#sb-filter-id" />
                </div>
            );
        } else if (
            this.state.allItems &&
            this.state.allItems.kind === "loading"
        ) {
            content = <div className="loader" />;
        }

        return content;
    }
}
