import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as UrlHelper from '../Models/UrlHelper';
import { RouteComponentProps } from 'react-router';
import {
    ItemCardModel,
    Resource,
    getResourceContent,
    SubjectModel,
    AboutItemModel,
    get,
    ItemModel,
    ItemsSearchFilterModel,
    BasicFilterCategoryModel,
    ItemSearch,
    SearchUrl,
    Filter,
    AdvancedFilterCategoryModel,
    SearchAPIParamsModel,
    ItemTableContainer,
    FilterContainer
} from '@osu-cass/sb-components';
import { getBasicFilterCategories, getAdvancedFilterCategories, getItemSearchModel } from './ScoreGuideModels';
import { FilterCategoryModel } from '@osu-cass/sb-components/lib/Filter/FilterModels';

export interface Props extends RouteComponentProps<{}> {
    itemsSearchFilterClient: () => Promise<ItemsSearchFilterModel>;
    aboutItemClient: (params: ItemModel) => Promise<AboutItemModel>;
    itemCardClient: () => Promise<ItemCardModel[]>;
}

export interface State {
    item: Resource<AboutItemModel>;
    allItems: Resource<ItemCardModel[]>;
    itemsSearchFilter: Resource<ItemsSearchFilterModel>;
    basicFilterOptions: BasicFilterCategoryModel[];
    advancedFilterOptions: AdvancedFilterCategoryModel[];
    visibleItems: ItemCardModel[];
}

export class ScoringGuidePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemsSearchFilter: { kind: "loading" },
            allItems: { kind: "loading" },
            basicFilterOptions: [],
            advancedFilterOptions: [],
            item: { kind: "none" },
            visibleItems: []
        };

        this.loadSearchData();
    }

    loadSearchData() {
        Promise.all([this.props.itemCardClient(), this.props.itemsSearchFilterClient()])
            .then(([cards, filterModel]) => this.onLoadSuccess(cards, filterModel))
            .catch((err) => this.onLoadFailure(err));
    }

    onLoadSuccess = (cards: ItemCardModel[], filterModel: ItemsSearchFilterModel) => {
        const searchParams = SearchUrl.decodeSearch(this.props.location.search);
        const filteredItems = ItemSearch.filterItemCards(cards, searchParams);

        const basicFilter = getBasicFilterCategories(filterModel, searchParams);
        let advancedFilter = getAdvancedFilterCategories(filterModel, searchParams);

        const searchModel = getItemSearchModel(filterModel);
        advancedFilter = Filter.getUpdatedSearchFilters(searchModel, advancedFilter, searchParams);

        this.setState({
            allItems: { kind: "success", content: cards },
            itemsSearchFilter: { kind: "success", content: filterModel },
            basicFilterOptions: basicFilter,
            advancedFilterOptions: advancedFilter,
            visibleItems: filteredItems
        });
    }

    onLoadFailure(err: any) {
        console.error(err);
        this.setState({
            allItems: { kind: "failure" },
            itemsSearchFilter: { kind: "failure" }
        });
    }

    getAboutItem = (item: ItemModel) => {
        this.props.aboutItemClient(item)
            .then((data) => {
                this.onAboutItemSuccess(data)
            })
            .catch((err) => {
                this.onAboutItemError(err)
            });
    }

    onAboutItemSuccess = (data: AboutItemModel) => {
        const item: Resource<AboutItemModel> = { kind: "success", content: data };
        this.setState({ item });
    }

    onAboutItemError = (err: any) => {
        console.error(err);
        this.setState({
            item: { kind: "failure" }
        });
    }

    onRowSelection = (item: ItemModel, reset: boolean) => {
        if (reset === false) {
            this.getAboutItem(item);
        } else {
            let item: Resource<AboutItemModel> = { kind: "none" };
            this.setState({ item });
        }
    }

    onFilterApplied(basicFilter: BasicFilterCategoryModel[], advancedFilter: AdvancedFilterCategoryModel[]) {
        let bothFilters: FilterCategoryModel[] = basicFilter;
        bothFilters = bothFilters.concat(advancedFilter);
        
        const searchParams = ItemSearch.filterToSearchApiModel(bothFilters);
        this.props.history.push(SearchUrl.encodeQuery(searchParams));
        const searchFilterModel = getResourceContent(this.state.itemsSearchFilter);

        const allItems = getResourceContent(this.state.allItems);
        let filteredItems: ItemCardModel[] = [];
        if (allItems) {
            filteredItems = ItemSearch.filterItemCards(allItems, searchParams);
        }

        if (searchFilterModel) {
            const searchModel = getItemSearchModel(searchFilterModel);
            const newAdvancedFilter = Filter.getUpdatedSearchFilters(searchModel, advancedFilter, searchParams);
            this.setState({
                advancedFilterOptions: newAdvancedFilter,
                basicFilterOptions: basicFilter,
                visibleItems: filteredItems
            });
        }
    }

    onBasicFilterApplied = (filter: BasicFilterCategoryModel[]) => {
        this.onFilterApplied(filter, this.state.advancedFilterOptions);
    }

    onAdvancedFilterApplied = (filter: AdvancedFilterCategoryModel[]) => {
        this.onFilterApplied(this.state.basicFilterOptions, filter);
    }

    renderFilterComponent() {
        let bothFilters: FilterCategoryModel[] = this.state.basicFilterOptions;
        bothFilters = bothFilters.concat(this.state.advancedFilterOptions);
        const searchModel = ItemSearch.filterToSearchApiModel(bothFilters);
        const urlParamString = SearchUrl.encodeQuery(searchModel);

        return (
            <div className="search-controls">
                <a href={`api/pdf${urlParamString}`}>
                    <button>Print Items</button>
                </a>
                
                <FilterContainer
                    basicFilterOptions={this.state.basicFilterOptions}
                    onBasicFilterClick={this.onBasicFilterApplied}
                    advancedFilterOptions={this.state.advancedFilterOptions}
                    onAdvancedFilterClick={this.onAdvancedFilterApplied} />

                {this.renderTableComponent()}
            </div>
        );
    }

    renderTableComponent() {
        if (this.state.visibleItems.length > 0) {
            return (
                <ItemTableContainer
                    onRowSelection={this.onRowSelection}
                    itemCards={this.state.visibleItems}
                    item={this.state.item} />
            );

        }
        else if (this.state.allItems.kind == "failure") {
            return <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div>
        }
        else {
            return <div>Loading...</div>
        }
    }

    render() {
        const scoringModel = getResourceContent(this.state.itemsSearchFilter);

        if (scoringModel) {
            return (
                <div className="search-page">
                    <div className="search-container">
                        {this.renderFilterComponent()}
                    </div>
                </div>
            );
        }
        else {
            return <div></div>;
        }

    }
}


