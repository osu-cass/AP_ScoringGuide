import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ItemViewerFrame from './ItemViewerFrame';
import * as ItemModels from './ItemModels';
import * as ApiModels from './ApiModels';
import * as ItemCard from './ItemCard';
import * as GradeLevels from './GradeLevels';
import * as ItemCardViewer from './ItemCardViewer';
import * as AboutItem from './AboutItem';
import * as ItemTable from './ItemTable';
import * as ItemSearchDropdown from './ItemSearchDropdown';

export interface State {
    searchParams: ItemModels.ScoreSearchParams;
    itemSearchResult: ApiModels.Resource<ItemCard.ItemCardViewModel[]>;
    selectedItem: ApiModels.Resource<AboutItem.AboutThisItem>;
}

export interface Props {
}

export interface State {
    selectedRow?: number; // Show only MCRs with this row number. This doesn't refer to a single MCR.
    sorts: ItemTable.HeaderSort[];
}

export class ScoringGuidePage extends React.Component<Props, State> {
    private headerColumns = ItemTable.headerColumns;
    private dataTableRef: HTMLTableElement;

    constructor(props: Props) {
        super(props);
        this.state = {
            searchParams: {
                gradeLevels: GradeLevels.GradeLevels.NA,
                subjects: [],
                techType: []
            },
            itemSearchResult: { kind: "loading" },
            selectedItem: { kind: "loading" },
            selectedRow: 1,
            sorts: [],
        }
        this.callSearch();
    }

    onSelectItem = (item: ItemCard.ItemCardViewModel) => {
        AboutItem.ScoreSearchClient({ bankKey: item.bankKey, itemKey: item.itemKey })
            .then((data) => this.onAboutItemSuccess(data))
            .catch((err) => this.onAboutItemError(err));
    };

    onAboutItemSuccess(item: AboutItem.AboutThisItem) {
        this.setState({
            selectedItem: { kind: "success", content: item }
        });
    }

    onAboutItemError(err: any) {

    }

    onSearchSuccess(result: ItemCard.ItemCardViewModel[]) {
        const searchParams = this.state.searchParams;
        const items = result;
        this.setState({
            itemSearchResult: { kind: "success", content: items },
        });
    }

    onSearchError(err: any) {
        console.log(err);
    }

    async callSearch() {
        const searchParams = this.state.searchParams;
        return ItemModels.ScoreSearchClient(searchParams)
            .then((data) => this.onSearchSuccess(data))
            .catch((err) => this.onSearchError(err));
    }

    isLoading() {
        return this.state.itemSearchResult.kind === "loading" || this.state.itemSearchResult.kind === "reloading";
    }

    renderAboutItemDetails() {
        const selectedResult = this.state.selectedItem;
        if (selectedResult.kind == "success" && selectedResult.content) {
            const itemCard = selectedResult.content.itemCardViewModel;
            const url = "http://ivs.smarterbalanced.org/items?ids=" + itemCard.bankKey.toString() + "-" + itemCard.itemKey.toString();
            return (
                <div>
                    <ItemCardViewer.ItemCardViewer {...selectedResult.content} />
                    <ItemViewerFrame.ItemFrame url={url} />
                </div>
            );
        } else {
            return (<div></div>);
        }

    }

    onClickHeader = (col: ItemTable.SortColumn) => {
        const newSorts = (this.state.sorts || []).slice();
        const headIdx = newSorts.findIndex(hs => hs.col.header === col.header);
        if (headIdx !== -1) {
            const newSort = Object.assign({}, newSorts[headIdx]);
            newSort.direction = newSort.direction === ItemTable.SortDirection.Ascending
                ? ItemTable.SortDirection.Descending
                : ItemTable.SortDirection.Ascending;
            newSorts[headIdx] = newSort;
        } else {
            const newSort: ItemTable.HeaderSort = {
                col: col,
                direction: ItemTable.SortDirection.Ascending
            };
            newSorts.push(newSort);
        }
        this.setState({ sorts: newSorts });
    }

    clearSort = () => {
        this.setState({ sorts: [] });
    }

    invokeMultiSort(lhs: ItemCard.ItemCardViewModel, rhs: ItemCard.ItemCardViewModel): number {
        const sorts = this.state.sorts || [];
        for (const sort of sorts) {
            const diff = sort.col.compare(lhs, rhs) * sort.direction;
            if (diff !== 0) {
                return diff;
            }
        }
        return 0;
    }

    //Post sorted table data.
    getTableData(data: ItemCard.ItemCardViewModel[]): ItemTable.dataTableModel[] {
        const sortedData = this.state.sorts && this.state.sorts.length !== 0
            ? data.sort((lhs, rhs) => this.invokeMultiSort(lhs, rhs))
            : data;

        return sortedData;
    }



    renderSearch() {
        const searchResults = this.state.itemSearchResult;

        let resultElement: JSX.Element[] | JSX.Element | undefined;
        if (searchResults.kind === "success" || searchResults.kind === "reloading") {
            if (searchResults.content == null || searchResults.content.length === 0) {
                resultElement = <span className="placeholder-text" role="alert">No results found for the given search terms.</span>
            }
            else {

                //<ItemSearchDropdown.ItemSearchDropdown
                //    interactionTypes={this.props.interactionTypes}
                //    subjects={this.props.subjects}
                //    onChange={(params) => this.beginSearch(params)}
                //    selectSingleResult={() => this.selectSingleResult()}
                //    isLoading={false} />


                resultElement =
                    <div className="search-container">
                    <div className="search-results">
                        <div className="search-controls">

                            
                            


                            <button className="clear-sort" onClick={this.clearSort}>Clear Sort</button>
                            <button>Print Items</button>
                        </div>
                        <ItemTable.HeaderTable
                            sorts={this.state.sorts}
                            onHeaderClick={this.onClickHeader}
                            columns={this.headerColumns} />
                        <ItemTable.DataTable
                            mapRows={this.getTableData(searchResults.content)}
                            rowOnClick={this.onSelectItem}
                            sort={this.state.sorts}
                            tableRef={ref => this.dataTableRef = ref}
                            columns={this.headerColumns} />
                        </div>
                    </div>;
            }
        } else if (searchResults.kind === "failure") {
            resultElement = <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div>;
        }

        return resultElement;
    }

    render() {
      
        const isLoading = this.isLoading();
        return (
            <div className="search-container">
                {this.renderSearch()}
                {this.renderAboutItemDetails()}
            </div>
        );
    }
}

export function initializePage() {
    const container = document.getElementById("react-page-container");
    ReactDOM.render(<ScoringGuidePage />, container)
}