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

export interface Props {
    onRowSelection: (item: { itemKey: number; bankKey: number }, reset: boolean) => void;
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
            SearchUrl.encodeQuery(searchAPI);
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
        const subject = searchModel.subjects && searchModel.subjects[0] 
            ? searchModel.subjects[0]
            : "";
        let techType: string;
        if (searchModel.catOnly) {
            techType = "CAT";
        } else if (searchModel.performanceOnly) {
            techType = "PT";
        } else {
            techType = "";
        }

        return (
            <div className="search-controls">
                <form action="/api/pdf" method="get" id="print-items-form">
                    <input type="hidden" name="grade" value={searchModel.gradeLevels} />
                    <input type="hidden" name="subject" value={subject} />
                    <input type="hidden" name="techType" value={techType} />
                    <input type="submit" value="Print Items" />
                </form>
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
