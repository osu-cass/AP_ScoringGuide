import * as React from 'react';
import * as ItemCardViewModel from '../Models/ItemCardViewModel';
import * as ItemModels from '../Models/ItemModels';
import * as ItemPageTable from '../ItemTable/ItemPageTable';
import * as ApiModels from "../Models/ApiModels";
import { FilterHelper } from "../Models/FilterHelper";
import { AdvancedFilterContainer, AdvancedFilterCategory, AdvancedFilters } from "@osu-cass/react-advanced-filter";
import * as AboutItemVM from '../Models/AboutItemVM';
import * as UrlHelper from '../Models/UrlHelper';

const SearchClient = () => ApiModels.get<ItemCardViewModel.ItemCardViewModel[]>("api/search");

export interface Props {
    onRowSelection: (item: { itemKey: number; bankKey: number }, reset: boolean) => void;
    filterOptions: AdvancedFilterCategory[];
    searchClient: () => Promise<ItemCardViewModel.ItemCardViewModel[]>;
    item: ApiModels.Resource<AboutItemVM.AboutThisItem>;
}

export interface State {
    itemSearchResult: ApiModels.Resource<ItemCardViewModel.ItemCardViewModel[]>;
    visibleItems?: ItemCardViewModel.ItemCardViewModel[];
    itemFilter: AdvancedFilterCategory[];
}

export interface ItemsSearchViewModel {
    subjects: ItemModels.Subject[];
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

    onSearchSuccess(data: ItemCardViewModel.ItemCardViewModel[]): void {
        this.setState({
            itemSearchResult: { kind: "success", content: data },
            visibleItems: FilterHelper.filter(data, this.state.itemFilter)
        });
    }

    onSearchFailure(err: any) {
        console.error(err);
        this.setState({
            itemSearchResult: { kind: "failure" }
        });
    }

    onFilterApplied = (filter: AdvancedFilterCategory[]) => {
        if(this.state.itemSearchResult.kind == "success" || this.state.itemSearchResult.kind == "reloading") {
            const filtered = FilterHelper.filter(this.state.itemSearchResult.content || [], filter);
            this.setState({
                visibleItems: filtered,
                itemFilter: filter
            });
            UrlHelper.updateUrl(filter);
        }
    }

    renderTableComponent() {
        if (this.state.visibleItems) {
            return (
                <ItemPageTable.ItemPageTable
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
