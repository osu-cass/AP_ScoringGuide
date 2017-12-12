import * as React from 'react';
import * as UrlHelper from '../Models/UrlHelper';
import {
    AdvancedFilterContainer,
    ItemCardModel,
    AboutItemModel,
    SubjectModel,
    get,
    Resource,
    ItemTableContainer,
    ItemSearch,
    getResourceContent,
    BasicFilterCategoryModel,
    BasicFilterContainer,
    SearchUrl,
    FilterContainer,
    AdvancedFilterCategoryModel, 
    FilterCategoryModel,
    SearchAPIParamsModel
} from '@osu-cass/sb-components';

export interface Props {
    onRowSelection: (item: { itemKey: number; bankKey: number }, reset: boolean) => void;
    onFilterSelection: (filter: SearchAPIParamsModel) => void;
    basicFilterOptions: BasicFilterCategoryModel[];
    advancedFilterOptions: AdvancedFilterCategoryModel[];
    searchClient: () => Promise<ItemCardModel[]>;
    item: Resource<AboutItemModel>;
}

export interface State {
    itemSearchResult: Resource<ItemCardModel[]>;
    visibleItems?: ItemCardModel[];
    basicFilter: BasicFilterCategoryModel[];
    advancedFilter: AdvancedFilterCategoryModel[];
}


export class ItemSearchContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemSearchResult: { kind: "none" },
            basicFilter: props.basicFilterOptions,
            advancedFilter: props.advancedFilterOptions
        };

        this.callSearch();
    }

    callSearch() {
        this.props.searchClient()
            .then((data) => this.onSearchSuccess(data))
            .catch((err) => this.onSearchFailure(err));
    }

    onSearchSuccess(data: ItemCardModel[]): void {
        const searchApi = ItemSearch.filterToSearchApiModel(this.state.basicFilter);
        const filteredItems = ItemSearch.filterItemCards(data, searchApi);
        this.setState({
            itemSearchResult: { kind: "success", content: data },
            visibleItems: filteredItems
        });
    }

    onSearchFailure(err: any) {
        console.error(err);
        this.setState({
            itemSearchResult: { kind: "failure" }
        });
    }

    onBasicFilterApplied = (filter: BasicFilterCategoryModel[]) => {
        const allItems = getResourceContent(this.state.itemSearchResult);
        let filteredItems: ItemCardModel[] | undefined = undefined;

        if (allItems) {
            let bothFilters: FilterCategoryModel[] = filter;
            bothFilters = bothFilters.concat(this.state.advancedFilter);
            const searchParams = ItemSearch.filterToSearchApiModel(bothFilters);
            filteredItems = ItemSearch.filterItemCards(allItems, searchParams);
            this.props.onFilterSelection(searchParams);
        }

        this.setState({
            visibleItems: filteredItems,
            basicFilter: filter
        });
    }

    onAdvancedFilterApplied = (filter: AdvancedFilterCategoryModel[]) => {
        const allItems = getResourceContent(this.state.itemSearchResult);
        let filteredItems: ItemCardModel[] | undefined = undefined;

        if (allItems) {
            let bothFilters: FilterCategoryModel[] = filter;
            bothFilters = bothFilters.concat(this.state.basicFilter);
            const searchParams = ItemSearch.filterToSearchApiModel(bothFilters);
            filteredItems = ItemSearch.filterItemCards(allItems, searchParams);
            this.props.onFilterSelection(searchParams);
        }

        this.setState({
            visibleItems: filteredItems,
            advancedFilter: filter
        });
    }

    renderTableComponent() {
        if (this.state.visibleItems) {
            return (
                <ItemTableContainer
                    onRowSelection={this.props.onRowSelection}
                    itemCards={this.state.visibleItems}
                    item={this.props.item} />
            );

        }
        else if (this.state.itemSearchResult.kind == "failure") {
            return <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div>
        }
        else {
            return <div>Loading...</div>
        }
    }

    render() {
        const searchModel = ItemSearch.filterToSearchApiModel(this.state.basicFilter);
        const urlParamString = SearchUrl.encodeQuery(searchModel);

        return (
            <div className="search-controls">
                <a href={`api/pdf${urlParamString}`}>
                    <button>Print Items</button>
                </a>
                
                <FilterContainer
                    basicFilterOptions={this.state.basicFilter}
                    onBasicFilterClick={this.onBasicFilterApplied}
                    advancedFilterOptions={this.state.advancedFilter}
                    onAdvancedFilterClick={this.onAdvancedFilterApplied} />

                {this.renderTableComponent()}
            </div>
        );
    }

}
