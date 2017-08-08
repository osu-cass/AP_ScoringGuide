import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ItemViewerFrame from './ItemViewerFrame';
import * as ItemModels from './ItemModels';
import * as ApiModels from './ApiModels';
import * as ItemCard from './ItemCard';
import * as GradeLevels from './GradeLevels';
import * as ItemCardViewer from './ItemCardViewer';
import * as AboutItem from './AboutItem';

export interface Props {
}

export interface State {
    searchParams: ItemModels.ScoreSearchParams;
    itemSearchResult: ApiModels.Resource<ItemCard.ItemCardViewModel[]>;
    selectedItem: ApiModels.Resource<AboutItem.AboutThisItem>;
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
            itemSearchResult: { kind: "loading" },
            selectedItem: { kind: "loading" }
        }
        this.callSearch();
    }

    //TODO: call as event handler
    onSelectItem = (item: ItemCard.ItemCardViewModel) => {
        AboutItem.ScoreSearchClient({ bankKey: item.bankKey, itemKey: item.itemKey })
            .then((data) => this.onAboutItemSuccess(data))
            .catch((err) => this.onAboutItemError(err));
    };

    onAboutItemSuccess(item: AboutItem.AboutThisItem) {
        this.setState({
            selectedItem: { kind: "success", content: item }
        })
    }

    onAboutItemError(err: any) {

    }

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

    render() {
        var result;
        if (this.state.itemSearchResult.kind == "success") {
            result = this.state.itemSearchResult.content;
        } else {
            result = null;
        }
        const selectedResult = this.state.selectedItem;
        if (selectedResult.kind == "success" && selectedResult.content) {
            const itemCard = selectedResult.content.itemCardViewModel;
            const url = "http://ivs.smarterbalanced.org/items?ids=" + itemCard.bankKey.toString() + "-" + itemCard.itemKey.toString(); 
            return (
                <div>
                    <ItemCardViewer.ItemCardViewer {...selectedResult.content} />
                    <ItemViewerFrame.ItemFrame url={url}/>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}

export function initializePage() {
    const container = document.getElementById("react-page-container");
    ReactDOM.render(<ScoringGuidePage />, container)
}