import * as React from 'react';
import * as ItemSearchDropdown from '../DropDown/ItemSearchDropDown';
import * as ItemCardViewModel from '../Models/ItemCardViewModel';
import * as ItemModels from '../Models/ItemModels';
import * as ItemPageTable from '../ItemTable/ItemPageTable';
import * as Api from '../Models/ApiModels';
import { FilterHelper } from '../Models/FilterHelper';
import * as AboutItemVM from '../Models/AboutItemVM';
import * as ApiModels from '../Models/ApiModels';

export interface Props {
    onRowSelection: (item: { itemKey: number; bankKey: number }, reset: boolean) => void;
    filterOptions: ItemModels.FilterOptions;
    searchClient: () => Promise<ItemCardViewModel.ItemCardViewModel[]>;
    item: ApiModels.Resource<AboutItemVM.AboutThisItem>;
}

export interface State {
    itemSearchResult: Api.Resource<ItemCardViewModel.ItemCardViewModel[]>;
    visibleItems?: ItemCardViewModel.ItemCardViewModel[];
    itemFilter: ItemModels.ItemFilter;
}

export interface ItemsSearchViewModel {
    subjects: ItemModels.Subject[];
}

export class ItemSearchContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemSearchResult: { kind: "none" },
            itemFilter: FilterHelper.readUrl(props.filterOptions)
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
            visibleItems: data
        });
    }

    onSearchFailure(err: any) {
        console.error(err);
        this.setState({
            itemSearchResult: { kind: "failure" }
        });
    }

    onFilterApplied = (filter: ItemModels.ItemFilter) => {
        if (this.state.itemSearchResult.kind == "success" || this.state.itemSearchResult.kind == "reloading") {
            const filtered = FilterHelper.filter(this.state.itemSearchResult.content || [], filter);
            this.setState({
                visibleItems: filtered,
                itemFilter: filter
            });
            FilterHelper.updateUrl(filter);
        }
    }

    renderDropDownComponent() {
        return (
            <ItemSearchDropdown.ItemSearchDropdown
                filterOptions={this.props.filterOptions}
                onChange={this.onFilterApplied}
                isLoading={false}
                itemFilter={this.state.itemFilter} />
        );
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
        const itemsValue = (this.state.visibleItems || [])
            .map(card => card.bankKey + "-"+ card.itemKey)
            .join(',');
        const subjectCode = this.state.itemFilter.subject 
            ? this.state.itemFilter.subject.code
            : "";
        const gradeCode = this.state.itemFilter.grade 
            ? this.state.itemFilter.grade.toString()
            : "";
        const techType = this.state.itemFilter.techType 
            ? this.state.itemFilter.techType.code
            : "";
        const style = {
            paddingRight: "5px",
            margin: "2px"
        }

        return (
            <div className="search-controls">
                <button style={style}>Print Items</button>
                {this.renderDropDownComponent()}
                <form action="/api/pdf" method="get" id="print-items-form">
                    <input type="hidden" name="grade" value={gradeCode} />
                    <input type="hidden" name="subject" value={subjectCode} />
                    <input type="hidden" name="techType" value={techType} />
                    <input type="submit" value="Print Items" />
                </form>
                {this.renderTableComponent()}
            </div>
        );
    }
}
