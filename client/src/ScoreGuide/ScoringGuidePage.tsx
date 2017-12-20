import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import {
    ItemCardModel,
    Resource,
    getResourceContent,
    SubjectModel,
    AboutItemModel,
    get,
    ItemModel,
    ItemsSearchFilterModel,
    BasicFilterCategoryModel,
    ItemSearch,
    SearchUrl,
    Filter,
    AdvancedFilterCategoryModel,
    SearchAPIParamsModel,
    ItemTableContainer,
    FilterCategoryModel,
    FilterContainer,
    FilterLink,
    GradeLevels
} from '@osu-cass/sb-components';
import { getBasicFilterCategories, getAdvancedFilterCategories, getItemSearchModel } from './ScoreGuideModels';

export interface Props extends RouteComponentProps<{}> {
    itemsSearchFilterClient: () => Promise<ItemsSearchFilterModel>;
    aboutItemClient: ( params: ItemModel ) => Promise<AboutItemModel>;
    itemCardClient: () => Promise<ItemCardModel[]>;
}

export interface State {
    item: Resource<AboutItemModel>;
    allItems: Resource<ItemCardModel[]>;
    itemsSearchFilter: Resource<ItemsSearchFilterModel>;
    basicFilterCategories: BasicFilterCategoryModel[];
    advancedFilterCategories: AdvancedFilterCategoryModel[];
    visibleItems: ItemCardModel[];
    searchAPIParams: SearchAPIParamsModel;
    nonSelectedFilters: string[];
}

export class ScoringGuidePage extends React.Component<Props, State> {
    constructor ( props: Props ) {
        super( props );
        this.state = {
            itemsSearchFilter: { kind: "loading" },
            allItems: { kind: "loading" },
            basicFilterCategories: [],
            advancedFilterCategories: [],
            item: { kind: "none" },
            visibleItems: [],
            searchAPIParams: SearchUrl.decodeSearch( this.props.location.search ),
            nonSelectedFilters: []
        };
    }

    componentDidMount () {
        Promise.all( [
            this.props.itemCardClient(),
            this.props.itemsSearchFilterClient()
        ] )
            .then( ( [ cards, filterModel ] ) =>
                this.onLoadSuccess( cards, filterModel ) )
            .catch( ( err ) =>
                this.onLoadFailure( err ) );
    }


    onLoadSuccess = ( cards: ItemCardModel[], filterModel: ItemsSearchFilterModel ) => {
        const { searchAPIParams } = this.state;
        const searchModel = getItemSearchModel( filterModel );
        let advancedFilter = getAdvancedFilterCategories( filterModel, searchAPIParams );
        this.setState( {
            allItems: { kind: "success", content: cards },
            itemsSearchFilter: { kind: "success", content: filterModel },
            basicFilterCategories: getBasicFilterCategories( filterModel, searchAPIParams ),
            advancedFilterCategories: Filter.getUpdatedSearchFilters( searchModel, advancedFilter, searchAPIParams ),
            visibleItems: ItemSearch.filterItemCards( cards, searchAPIParams )
        } );
    }

    onLoadFailure ( err: any ) {
        console.error( err );
        this.setState( {
            allItems: { kind: "failure" },
            itemsSearchFilter: { kind: "failure" }
        } );
    }

    getAboutItem = ( item: ItemModel ) => {
        this.props.aboutItemClient( item )
            .then( ( data ) => this.onAboutItemSuccess( data ) )
            .catch( ( err ) => this.onAboutItemError( err ) );
    }

    onAboutItemSuccess = ( data: AboutItemModel ) => {
        const item: Resource<AboutItemModel> = { kind: "success", content: data };
        this.setState( { item } );
    }

    onAboutItemError = ( err: any ) => {
        console.error( err );
        this.setState( {
            item: { kind: "failure" }
        } );
    }

    onRowSelection = ( item: ItemModel, reset: boolean ) => {
        if ( reset === false ) {
            this.getAboutItem( item );
        } else {
            let item: Resource<AboutItemModel> = { kind: "none" };
            this.setState( { item } );
        }
    }

    onFilterApplied ( basicFilterCategories: BasicFilterCategoryModel[], advancedFilterCategories: AdvancedFilterCategoryModel[] ) {
        let bothFilters: FilterCategoryModel[] = basicFilterCategories;
        bothFilters = bothFilters.concat( advancedFilterCategories );
        const searchAPIParams = ItemSearch.filterToSearchApiModel( bothFilters );
        const searchFilterModel = getResourceContent( this.state.itemsSearchFilter );
        const allItems = getResourceContent( this.state.allItems );
        let visibleItems: ItemCardModel[] = [];

        this.props.history.push( SearchUrl.encodeQuery( searchAPIParams ) );

        if ( allItems ) {
            visibleItems = ItemSearch.filterItemCards( allItems, searchAPIParams );
        }

        if ( searchFilterModel ) {
            const searchModel = getItemSearchModel( searchFilterModel );
            this.setState( {
                advancedFilterCategories: Filter.getUpdatedSearchFilters( searchModel, advancedFilterCategories, searchAPIParams ),
                basicFilterCategories,
                visibleItems,
                searchAPIParams
            } );
        }
    }

    onBasicFilterApplied = ( filter: BasicFilterCategoryModel[] ) => {
        this.onFilterApplied( filter, this.state.advancedFilterCategories );
    }

    onAdvancedFilterApplied = ( filter: AdvancedFilterCategoryModel[] ) => {
        this.onFilterApplied( this.state.basicFilterCategories, filter );
    }

    printItems = ( searchModel: SearchAPIParamsModel, urlParamString: string ) => {
        const { subjects, gradeLevels, performanceOnly, catOnly } = searchModel;
        let nonSelectedFilters: string[] = [];
        if ( subjects !== undefined && subjects.length <= 0 ) {
            nonSelectedFilters.push( "subject" );
        }
        if ( gradeLevels === GradeLevels.NA ) {
            nonSelectedFilters.push( "grade level" );
        }
        if ( performanceOnly === false && catOnly === false ) {
            nonSelectedFilters.push( "tech type" );
        }
        if ( nonSelectedFilters.length > 0 ) {
            this.setState( { nonSelectedFilters } );
        } else {
            window.location.href = `api/pdf${ urlParamString }`;
        }
    }

    renderErrorPrompt = () => {
        const { nonSelectedFilters } = this.state;
        let content = null;
        if ( nonSelectedFilters.length > 0 ) {
            let filterPrompt = "Please select a ";
            nonSelectedFilters.forEach( ( fil, idx ) => {
                if ( idx === 2 || ( nonSelectedFilters.length === 2 && idx === 1 ) ) {
                    filterPrompt = `${ filterPrompt } and ${ fil }.`;
                } else if ( nonSelectedFilters.length === 1 && idx === 0 ) {
                    filterPrompt = `${ filterPrompt } ${ fil }.`;
                } else {
                    filterPrompt = `${ filterPrompt } ${ fil },`;
                }
            } )
            content = <div>{filterPrompt}</div>
        }
        return content;
    }

    renderFilterComponent = () => {
        const { basicFilterCategories, advancedFilterCategories, nonSelectedFilters, searchAPIParams } = this.state;
        return (
            <div className="search-controls">
                <button
                    className="btn btn-blue btn-lg"
                    type="button"
                    onClick={() => this.printItems( searchAPIParams, SearchUrl.encodeQuery( searchAPIParams ) )}>
                    Print Items
                </button>
                {this.renderErrorPrompt()}
                <FilterContainer
                    filterId="sb-filter-id"
                    basicFilterCategories={basicFilterCategories}
                    onUpdateBasicFilter={this.onBasicFilterApplied}
                    advancedFilterCategories={advancedFilterCategories}
                    onUpdateAdvancedFilter={this.onAdvancedFilterApplied} />
                {this.renderTableComponent()}
            </div>
        );
    }

    renderTableComponent = () => {
        let content = ( <div>Loading...</div> );
        if ( this.state.visibleItems.length > 0 ) {
            content = (
                <ItemTableContainer
                    onRowSelection={this.onRowSelection}
                    itemCards={this.state.visibleItems}
                    item={this.state.item} />
            );
        }
        else if ( this.state.allItems.kind === "failure" ) {
            content = ( <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div> );
        }
        return content;
    }

    render () {
        const scoringModel = getResourceContent( this.state.itemsSearchFilter );
        let content = scoringModel ?
            <div className="container search-page">
                {this.renderFilterComponent()}
                <FilterLink filterId="sb-filter-id" />
            </div> : null;
        return content;
    }
}


