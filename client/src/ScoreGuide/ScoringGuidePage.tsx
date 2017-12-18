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
    FilterLink
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
    filterId: string;
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
            filterId: "sb-filter-id"
        };

        this.loadSearchData();
    }

    loadSearchData () {
        Promise.all( [ this.props.itemCardClient(), this.props.itemsSearchFilterClient() ] )
            .then( ( [ cards, filterModel ] ) => this.onLoadSuccess( cards, filterModel ) )
            .catch( ( err ) => this.onLoadFailure( err ) );
    }

    onLoadSuccess = ( cards: ItemCardModel[], filterModel: ItemsSearchFilterModel ) => {
        const searchParams = SearchUrl.decodeSearch( this.props.location.search );
        const filteredItems = ItemSearch.filterItemCards( cards, searchParams );

        const basicFilter = getBasicFilterCategories( filterModel, searchParams );
        let advancedFilter = getAdvancedFilterCategories( filterModel, searchParams );

        const searchModel = getItemSearchModel( filterModel );
        advancedFilter = Filter.getUpdatedSearchFilters( searchModel, advancedFilter, searchParams );

        this.setState( {
            allItems: { kind: "success", content: cards },
            itemsSearchFilter: { kind: "success", content: filterModel },
            basicFilterCategories: basicFilter,
            advancedFilterCategories: advancedFilter,
            visibleItems: filteredItems
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
            .then( ( data ) => {
                this.onAboutItemSuccess( data )
            } )
            .catch( ( err ) => {
                this.onAboutItemError( err )
            } );
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

    onFilterApplied ( basicFilter: BasicFilterCategoryModel[], advancedFilter: AdvancedFilterCategoryModel[] ) {
        let bothFilters: FilterCategoryModel[] = basicFilter;
        bothFilters = bothFilters.concat( advancedFilter );

        const searchParams = ItemSearch.filterToSearchApiModel( bothFilters );
        this.props.history.push( SearchUrl.encodeQuery( searchParams ) );
        const searchFilterModel = getResourceContent( this.state.itemsSearchFilter );

        const allItems = getResourceContent( this.state.allItems );
        let filteredItems: ItemCardModel[] = [];
        if ( allItems ) {
            filteredItems = ItemSearch.filterItemCards( allItems, searchParams );
        }

        if ( searchFilterModel ) {
            const searchModel = getItemSearchModel( searchFilterModel );
            const newAdvancedFilter = Filter.getUpdatedSearchFilters( searchModel, advancedFilter, searchParams );
            this.setState( {
                advancedFilterCategories: newAdvancedFilter,
                basicFilterCategories: basicFilter,
                visibleItems: filteredItems
            } );
        }
    }

    onBasicFilterApplied = ( filter: BasicFilterCategoryModel[] ) => {
        this.onFilterApplied( filter, this.state.advancedFilterCategories );
    }

    onAdvancedFilterApplied = ( filter: AdvancedFilterCategoryModel[] ) => {
        this.onFilterApplied( this.state.basicFilterCategories, filter );
    }

    renderFilterComponent () {
        const { basicFilterCategories, advancedFilterCategories, filterId } = this.state
        let bothFilters: FilterCategoryModel[] = this.state.basicFilterCategories;
        bothFilters = bothFilters.concat( this.state.advancedFilterCategories );
        const searchModel = ItemSearch.filterToSearchApiModel( bothFilters );
        const urlParamString = SearchUrl.encodeQuery( searchModel );

        return (
            <div className="search-controls">
                <a className="btn btn-blue btn-lg" role="button" href={`api/pdf${ urlParamString }`}>
                    Print Items
                </a>

                <FilterContainer
                    filterId={this.state.filterId}
                    basicFilterCategories={basicFilterCategories}
                    onUpdateBasicFilter={this.onBasicFilterApplied}
                    advancedFilterCategories={advancedFilterCategories}
                    onUpdateAdvancedFilter={this.onAdvancedFilterApplied} />

                {this.renderTableComponent()}
            </div>
        );
    }

    renderTableComponent () {
        let content = ( <div>Loading...</div> );
        if ( this.state.visibleItems.length > 0 ) {
            content = (
                <ItemTableContainer
                    onRowSelection={this.onRowSelection}
                    itemCards={this.state.visibleItems}
                    item={this.state.item} />
            );
        }
        else if ( this.state.allItems.kind == "failure" ) {
            content = ( <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div> );
        }
        return content;
    }

    render () {
        const scoringModel = getResourceContent( this.state.itemsSearchFilter );

        if ( scoringModel ) {
            return (
                <div className="container search-page">
                    {this.renderFilterComponent()}
                    <FilterLink filterId={`#${ this.state.filterId }`} />
                </div>
            );
        }
        else {
            return <div></div>;
        }

    }
}


