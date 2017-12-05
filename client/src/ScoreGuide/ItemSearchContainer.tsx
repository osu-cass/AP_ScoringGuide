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
    SearchUrl
} from '@osu-cass/sb-components';
import { SearchAPIParamsModel } from '@osu-cass/sb-components/lib/ItemSearch/ItemSearchModels';

export interface Props {
    onRowSelection: (item: { itemKey: number; bankKey: number }, reset: boolean) => void;
    onFilterSelection: (filter: SearchAPIParamsModel) => void;
    filterOptions: BasicFilterCategoryModel[];
    searchClient: () => Promise<ItemCardModel[]>;
    item: Resource<AboutItemModel>;
}

export interface State {
    itemSearchResult: Resource<ItemCardModel[]>;
    visibleItems?: ItemCardModel[];
    itemFilter: BasicFilterCategoryModel[];
}


export class ItemSearchContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemSearchResult: { kind: "none" },
            itemFilter: props.filterOptions
        };

        this.callSearch();
    }

    callSearch() {
        this.props.searchClient()
            .then((data) => this.onSearchSuccess(data))
            .catch((err) => this.onSearchFailure(err));
    }

    onSearchSuccess(data: ItemCardModel[]): void {
        const searchApi = ItemSearch.filterToSearchApiModel(this.state.itemFilter);
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

    onFilterApplied = (filter: BasicFilterCategoryModel[]) => {
        const itemSearch = getResourceContent(this.state.itemSearchResult);
        let filteredItems: ItemCardModel[] | undefined = undefined;

        if (itemSearch) {
            const searchAPI = ItemSearch.filterToSearchApiModel(filter);
            filteredItems = ItemSearch.filterItemCards(itemSearch, searchAPI);
            this.props.onFilterSelection(searchAPI);
        }

        this.setState({
            visibleItems: filteredItems,
            itemFilter: filter
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
        const searchModel = ItemSearch.filterToSearchApiModel(this.state.itemFilter);
        const urlParamString = SearchUrl.encodeQuery(searchModel);

        return (
            <div className="search-controls">
                <a href={`api/pdf${urlParamString}`}>
                    <button>Print Items</button>
                </a>
                
                <BasicFilterContainer
                    filterOptions={this.state.itemFilter}
                    onClick={this.onFilterApplied}
                    containsAdvancedFilter={false}
                    handleAdvancedFilterExpand={() => {}}/>
                {this.renderTableComponent()}
            </div>
        );
    }

}
