import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as UrlHelper from '../Models/UrlHelper';
import { RouteComponentProps } from 'react-router';
import { ItemSearchContainer } from './ItemSearchContainer';
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
    SearchAPIParamsModel
} from '@osu-cass/sb-components';
import { getBasicFilterCategories, getAdvancedFilterCategories, getItemSearchModel } from './ScoreGuideModels';

export interface Props extends RouteComponentProps<{}> {
    itemsSearchFilterClient: () => Promise<ItemsSearchFilterModel>;
    aboutItemClient: (params: ItemModel) => Promise<AboutItemModel>;
    itemCardClient: () => Promise<ItemCardModel[]>;
}

export interface State {
    item: Resource<AboutItemModel>;
    itemsSearchFilter: Resource<ItemsSearchFilterModel>;
    basicFilterOptions: BasicFilterCategoryModel[];
    advancedFilterOptions: AdvancedFilterCategoryModel[];
}

export class ScoringGuidePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemsSearchFilter: { kind: "loading" },
            basicFilterOptions: [],
            advancedFilterOptions: [],
            item: { kind: "none" }
        }
        this.loadScoringGuideViewModel();
    }

    getAboutItem = (item: ItemModel) => {
        this.props.aboutItemClient(item)
            .then((data) => {
                this.onAboutItemSuccess(data)
            })
            .catch((err) => {
                this.onAboutItemError(err)
            });
    }

    onAboutItemSuccess = (data: AboutItemModel) => {
        const item: Resource<AboutItemModel> = { kind: "success", content: data };
        this.setState({ item });
    }

    onAboutItemError = (err: any) => {
        console.error(err);
        this.setState({
            item: { kind: "failure" }
        })
    }

    loadScoringGuideViewModel = () => {
        this.props.itemsSearchFilterClient()
            .then(result => this.onSuccessLoadScoringGuideViewModel(result))
            .catch(err => this.onErrorLoadScoringGuideViewModel(err));

    }

    onSuccessLoadScoringGuideViewModel = (result: ItemsSearchFilterModel) => {
        const basicFilterCategories = getBasicFilterCategories(result);
        const advancedFilterCategories = getAdvancedFilterCategories(result);
        const urlParams = SearchUrl.decodeSearch(this.props.location.search);
        
        this.setState({
            itemsSearchFilter: { kind: "success", content: result },
            basicFilterOptions: basicFilterCategories
        });
    }

    onErrorLoadScoringGuideViewModel = (err: any) => {
        console.error(err);
        this.setState({
            itemsSearchFilter: { kind: "failure" }
        });
    }

    onRowSelection = (item: ItemModel, reset: boolean) => {
        if (reset === false) {
            this.getAboutItem(item);
        } else {
            let item: Resource<AboutItemModel> = { kind: "none" };
            this.setState({ item });
        }
    }

    onFilterSelection = (filter: SearchAPIParamsModel) => {
        this.props.history.push(SearchUrl.encodeQuery(filter));
        const searchFilterModel = getResourceContent(this.state.itemsSearchFilter);
        if (searchFilterModel) {
            const searchModel = getItemSearchModel(searchFilterModel);
            const newAdvancedFilter = Filter.getUpdatedSearchFilters(searchModel, this.state.advancedFilterOptions, filter);
            this.setState({
                advancedFilterOptions: newAdvancedFilter
            });
        }
    }

    render() {
        const scoringModel = getResourceContent(this.state.itemsSearchFilter);

        if (scoringModel) {
            return (
                <div className="search-page">
                    <div className="search-container">
                        <ItemSearchContainer
                            onRowSelection={this.onRowSelection}
                            basicFilterOptions={this.state.basicFilterOptions}
                            advancedFilterOptions={this.state.advancedFilterOptions}
                            searchClient={this.props.itemCardClient}
                            item={this.state.item}
                            onFilterSelection={this.onFilterSelection}
                        />
                    </div>
                </div>
            );
        }
        else {
            return <div></div>;
        }

    }
}


