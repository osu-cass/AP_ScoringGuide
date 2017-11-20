import * as React from 'react';
import { FilterHelper } from "../Models/FilterHelper";
import * as UrlHelper from '../Models/UrlHelper';
import {
    AdvancedFilterContainer,
    ItemCardModel,
    AdvancedFilterCategoryModel,
    AboutItemModel,
    SubjectModel,
    get,
    Resource,
    ItemTableContainer,
    ItemSearch,
    getResourceContent
} from '@osu-cass/sb-components';


export interface Props {
    onRowSelection: (item: { itemKey: number; bankKey: number }, reset: boolean) => void;
    filterOptions: AdvancedFilterCategoryModel[];
    searchClient: () => Promise<ItemCardModel[]>;
    item: Resource<AboutItemModel>;
}

export interface State {
    itemSearchResult: Resource<ItemCardModel[]>;
    visibleItems?: ItemCardModel[];
    itemFilter: AdvancedFilterCategoryModel[];
}


export class ItemSearchContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemSearchResult: { kind: "none" },
            itemFilter: UrlHelper.readUrl(props.filterOptions)
        };

        this.callSearch();
    }

    callSearch() {
        this.props.searchClient()
            .then((data) => this.onSearchSuccess(data))
            .catch((err) => this.onSearchFailure(err));
    }

    onSearchSuccess(data: ItemCardModel[]): void {
        const searchApi = ItemSearch.advancedFilterToSearch(this.state.itemFilter);
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

    onFilterApplied = (filter: AdvancedFilterCategoryModel[]) => {
        const itemSearch = getResourceContent(this.state.itemSearchResult);
        let filteredItems: ItemCardModel[] | undefined = undefined;

        if (itemSearch) {
            const searchAPI = ItemSearch.advancedFilterToSearch(filter);
            filteredItems = ItemSearch.filterItemCards(itemSearch, searchAPI);
        }
        
        UrlHelper.updateUrl(filter);
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
        const codes = ["Grade", "Subject", "Tech Type"].map(s => {
            const category = this.state.itemFilter.find(f => f.label == s);
            const option = category
                ? category.filterOptions.find(o => o.isSelected)
                : undefined;
            return option ? option.key : "";
        });

        return (
            <div className="search-controls">
                <form action="/api/pdf" method="get" id="print-items-form">
                    <input type="hidden" name="grade" value={codes[0]} />
                    <input type="hidden" name="subject" value={codes[1]} />
                    <input type="hidden" name="techType" value={codes[2]} />
                    <input type="submit" value="Print Items" />
                </form>
                <AdvancedFilterContainer
                    filterOptions={this.state.itemFilter}
                    onClick={this.onFilterApplied} />
                {this.renderTableComponent()}
            </div>
        );
    }

}
