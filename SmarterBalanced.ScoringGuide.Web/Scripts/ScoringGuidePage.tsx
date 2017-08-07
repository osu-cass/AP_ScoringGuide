import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ItemViewerFrame from './ItemViewerFrame';
import * as ItemModels from './ItemModels';
import * as ApiModels from './ApiModels';
import * as ItemCard from './ItemCard';
import * as GradeLevels from './GradeLevels';
import * as ItemTable from './ItemTable';

export interface Props {
}

export interface State {
    searchParams: ItemModels.ScoreSearchParams;
    itemSearchResult: ApiModels.Resource<ItemCard.ItemCardViewModel[]>;
    selectedItem?: ItemCard.ItemCardViewModel;
}

export class ScoringGuidePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            searchParams: {
                gradeLevels: GradeLevels.GradeLevels.NA,
                subjects: [],
                techType: ["pt"]
            },
            itemSearchResult: { kind: "loading" }
        }
        this.callSearch();
    }

    //TODO: call as event handler
    onSelectItem = (item: ItemCard.ItemCardViewModel) => {
        this.setState({
            selectedItem: item
        })
    };

    onSearchSuccess(result: ItemCard.ItemCardViewModel[]) {
        const searchParams = this.state.searchParams;
        const items = result;
        this.setState({
            itemSearchResult: { kind: "success", content: items },
        });
        //TODO: remove once table is implemented
        this.onSelectItem(items[0]);
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

    render() {
        const searchResults = this.state.itemSearchResult;

        let resultElement: JSX.Element[] | JSX.Element | undefined;
        if (searchResults.kind === "success" || searchResults.kind === "reloading") {
            if (searchResults.content == null || searchResults.content.length === 0) {
                resultElement = <span className="placeholder-text" role="alert">No results found for the given search terms.</span>
            }
            else {
                const TableModel: ItemTable.ItemTableModel = {
                    data: searchResults.content,
                    sortables: {
                        item: { State: ItemTable.SortingState.NoSort, Priority: 0 },
                        subject: { State: ItemTable.SortingState.NoSort, Priority: 0 },
                        grade: { State: ItemTable.SortingState.NoSort, Priority: 0 },
                        claimAndTaget: { State: ItemTable.SortingState.NoSort, Priority: 0 },
                        interactionType: { State: ItemTable.SortingState.NoSort, Priority: 0 }
                    }
                };
                resultElement = <ItemTable.ItemTable {...TableModel} />;
            }
        } else if (searchResults.kind === "failure") {
            resultElement = <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div>;
        } else {
            resultElement = undefined;
        }
        const isLoading = this.isLoading();
        return (
            // TODO: ItemViewer Stuff
            //<ItemViewerFrame.ItemFrame url="http://ivs.smarterbalanced.org/items?ids=187-1437" />


            <div className="search-container">
                {resultElement}
            </div>
        );
    }
}

export function initializePage() {
    const container = document.getElementById("react-page-container");
    ReactDOM.render(<ScoringGuidePage />, container)

}