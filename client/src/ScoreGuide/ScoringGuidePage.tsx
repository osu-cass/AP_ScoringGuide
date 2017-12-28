import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import {
    ItemCardModel,
    Resource,
    getResourceContent,
    AboutItemModel,
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
import {
    pdfURLPost,
    pdfBodyPost,
    getBasicFilterCategories,
    getAdvancedFilterCategories,
    getItemSearchModel
} from './ScoreGuideModels';

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
    selectedItems: ItemModel[];
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
            selectedItems: [],
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
        const advancedFilter = getAdvancedFilterCategories( filterModel, searchAPIParams );
        this.setState( {
            allItems: { kind: "success", content: cards },
            itemsSearchFilter: { kind: "success", content: filterModel },
            basicFilterCategories: getBasicFilterCategories( filterModel, searchAPIParams ),
            advancedFilterCategories: Filter.getUpdatedSearchFilters( searchModel, advancedFilter, searchAPIParams ),
            visibleItems: ItemSearch.filterItemCards( cards, searchAPIParams )
        } );
    }

    onLoadFailure ( err: Error ) {
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

    onAboutItemError = ( err: Error ) => {
        console.error( err );
        this.setState( {
            item: { kind: "failure" }
        } );
    }
    handleItemSelection = ( item: ItemCardModel ) => {
        const { selectedItems, visibleItems } = this.state;
        const { itemKey, bankKey } = item;
        const selectedItem: ItemModel = { itemKey, bankKey };
        const idx = selectedItems.findIndex( value => value.itemKey === selectedItem.itemKey && value.bankKey === selectedItem.bankKey );
        const itemIdx = visibleItems.findIndex( value => value === item );
        if ( idx > -1 ) {
            selectedItems.splice( idx, 1 );
        } else {
            selectedItems.push( selectedItem );
        }
        visibleItems[ itemIdx ].selected = !visibleItems[ itemIdx ].selected;
        this.setState( { selectedItems, visibleItems } );
    }


    handleRowSelection = ( item: ItemModel, reset: boolean ) => {
        if ( reset === false ) {
            this.getAboutItem( item );
        } else {
            const item: Resource<AboutItemModel> = { kind: "none" };
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
                basicFilterCategories,
                visibleItems,
                searchAPIParams,
                advancedFilterCategories: Filter.getUpdatedSearchFilters( searchModel, advancedFilterCategories, searchAPIParams ),
                selectedItems: []
            } );
        }
    }

    handleBasicFilterApplied = ( filter: BasicFilterCategoryModel[] ) => {
        this.onFilterApplied( filter, this.state.advancedFilterCategories );
    }

    handleAdvancedFilterApplied = ( filter: AdvancedFilterCategoryModel[] ) => {
        this.onFilterApplied( this.state.basicFilterCategories, filter );
    }

    printItems ( searchModel: SearchAPIParamsModel ): void {
        const { subjects, gradeLevels, performanceOnly, catOnly } = searchModel;
        const nonSelectedFilters: string[] = [];
        if ( !subjects || subjects.length <= 0 ) {
            nonSelectedFilters.push( "subject" );
        }
        if ( !gradeLevels || gradeLevels.valueOf() === GradeLevels.NA ) {
            nonSelectedFilters.push( "grade level" );
        }
        if ( !performanceOnly && !catOnly ) {
            nonSelectedFilters.push( "tech type" );
        }
        if ( nonSelectedFilters.length > 0 ) {
            this.setState( { nonSelectedFilters } );
        }
        else {
            if ( this.state.selectedItems.length > 0 ) {
                pdfBodyPost( this.state.selectedItems );
            } else {
                pdfURLPost( SearchUrl.encodeQuery( searchModel ) );
            }
        }
    }

    renderErrorPrompt (): JSX.Element | undefined {
        const { nonSelectedFilters } = this.state;
        let content;
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
            } );
            content = <div>{filterPrompt}</div>;
        }

        return content;
    }

    renderFilterComponent (): JSX.Element {
        const { basicFilterCategories, advancedFilterCategories, nonSelectedFilters, searchAPIParams } = this.state;

        return (
            <div className="search-controls">
                <button
                    className="btn btn-blue btn-lg"
                    type="button"
                    onClick={() => this.printItems( searchAPIParams )}>
                    Print Items
                </button>
                {this.renderErrorPrompt()}
                <FilterContainer
                    filterId="sb-filter-id"
                    basicFilterCategories={basicFilterCategories}
                    onUpdateBasicFilter={this.handleBasicFilterApplied}
                    advancedFilterCategories={advancedFilterCategories}
                    onUpdateAdvancedFilter={this.handleAdvancedFilterApplied} />
                {this.renderTableComponent()}
            </div>
        );
    }

    renderTableComponent (): JSX.Element {
        let content = ( <div className="loader" /> );
        if ( this.state.visibleItems.length > 0 ) {
            content = (
                <ItemTableContainer
                    onRowSelection={this.handleRowSelection}
                    onItemSelection={this.handleItemSelection}
                    itemCards={this.state.visibleItems}
                    item={this.state.item}
                />
            );
        }
        else if ( this.state.allItems.kind === "failure" ) {
            content = ( <div className="placeholder-text" role="alert">An error occurred. Please try again later.</div> );
        }

        return content;
    }

    render () {
        const { itemsSearchFilter } = this.state;
        const scoringModel = getResourceContent( itemsSearchFilter );
        let content = <div>Search failed</div>;
        if ( scoringModel ) {
            content = <div className="container search-page">
                {this.renderFilterComponent()}
                <FilterLink filterId="sb-filter-id" />
            </div>;
        } else if ( itemsSearchFilter && itemsSearchFilter.kind === "loading" ) {
            content = <div className="loader" />;
        }

        return content;
    }
}


