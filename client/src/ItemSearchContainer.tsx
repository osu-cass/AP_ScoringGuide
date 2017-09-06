import * as React from 'react'
import * as ApiModels from './ApiModels'
import * as ItemSearchDropdown from './ItemSearchDropDown'
import * as ItemCardViewModel from './ItemCardViewModel'
import * as ItemModels from './ItemModels'
import * as ItemTable from './ItemTable'
import * as ItemPageTable from './ItemPageTable'
import * as Api from "./ApiModels"

const SearchClient = (params: ItemModels.ScoreSearchParams) => Api.get<ItemCardViewModel.ItemCardViewModel[]>("http://is-score.cass.oregonstate.edu/ScoringGuide/Search", params);

export interface Props {
    scoringGuideViewModel?: ItemsSearchViewModel;
    onRowSelection: (item: {itemKey: number; bankKey: number}) => void;
    searchParams: ItemModels.ScoreSearchParams;
    
}

export interface State {
    itemSearchResult: Api.Resource<ItemCardViewModel.ItemCardViewModel[]>;
}

export interface ItemsSearchViewModel {
    interactionTypes: ItemSearchDropdown.InteractionType[];
    subjects: ItemSearchDropdown.Subject[];
}


export class ItemSearchContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props); 
        this.state = {
            itemSearchResult: { kind: "none" }
        }

        this.callSearch(props.searchParams);
    }
   
    //so now everytime we update the params we will call search. when the drop-down changes we will call this method. 
    callSearch(params: ItemModels.ScoreSearchParams){
        SearchClient(params)
         .then((data) => this.onSearchSuccess(data))
         .catch((err) => this.onSearchFailure(err));
    }

    onSearchSuccess(data: ItemCardViewModel.ItemCardViewModel[]): void{
        this.setState({
            itemSearchResult: { kind: "success", content: data }
        })
    }

    onSearchFailure(err: any){
        console.error(err);
        this.setState({
            itemSearchResult: { kind: "failure" } 
        })
    }

    renderDropDownComponent(){
        const scoringVM = this.props.scoringGuideViewModel;
        if ( scoringVM != undefined) {
            return (
               < ItemSearchDropdown.ItemSearchDropdown
                interactionTypes={scoringVM.interactionTypes}
                subjects={scoringVM.subjects}
                onChange={(params) => this.callSearch(params)}
                isLoading={false} />
            );
    
        }
    }

    //we need to check for content and do something. This makes sense. what do we want to ddo when we are 1) loading, 2) reloading, 3) error, 4) success
    renderTableComponent(){
        const cardsResult = this.state.itemSearchResult;
        if(cardsResult.kind == "success" || cardsResult.kind == "reloading"){
            return (
                <ItemPageTable.ItemPageTable 
                onRowSelection={this.props.onRowSelection} 
                itemCards={cardsResult.content}/>
            );
            
        }
        else if(cardsResult.kind == "failure"){
            return <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div>
        }
        else{
            return <div>Loading...</div>
        }
    }
 
    render() {
    
        return (
            <div className="search-controls">
                <a>Print Items</a>
                {this.renderDropDownComponent()}
                {this.renderTableComponent()}
            </div>
        );
    }

}
