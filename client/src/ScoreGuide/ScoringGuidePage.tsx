import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as UrlHelper from '../Models/UrlHelper';
import { RouteComponentProps } from 'react-router';
import { ItemSearchContainer } from './ItemSearchContainer';
import {
    ItemCardModel,
    ItemsSearchModel,
    Resource,
    getResourceContent,
    AdvancedFilterCategoryModel,
    SubjectModel,
    AboutItemModel,
    get,
    ItemModel

} from '@osu-cass/sb-components';
import { getFilterFromScoringGuideVM } from './ScoreGuideModels';


export interface Props extends RouteComponentProps<{}> {
    scoreGuideViewModelClient: () => Promise<ItemsSearchModel>;
    aboutItemClient: (params: ItemModel) => Promise<AboutItemModel>;
    itemCardClient: () => Promise<ItemCardModel[]>;
}

export interface State {
    item: Resource<AboutItemModel>;
    scoringGuideViewModel: Resource<ItemsSearchModel>;
    filterOptions: AdvancedFilterCategoryModel[];
}

export class ScoringGuidePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            scoringGuideViewModel: { kind: "loading" },
            filterOptions: [],
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
        this.props.scoreGuideViewModelClient()
            .then(result => this.onSuccessLoadScoringGuideViewModel(result))
            .catch(err => this.onErrorLoadScoringGuideViewModel(err));

    }

    onSuccessLoadScoringGuideViewModel = (result: ItemsSearchModel) => {
        this.setState({
            scoringGuideViewModel: { kind: "success", content: result },
            filterOptions: UrlHelper.readUrl(getFilterFromScoringGuideVM(result))
        });
    }

    onErrorLoadScoringGuideViewModel = (err: any) => {
        console.error(err);
        this.setState({
            scoringGuideViewModel: { kind: "failure" }
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

    render() {
        const scoringModel = getResourceContent(this.state.scoringGuideViewModel);

        if (scoringModel) {
            return (
                <div className="search-page">
                    <div className="search-container">
                        <ItemSearchContainer
                            onRowSelection={this.onRowSelection}
                            filterOptions={this.state.filterOptions}
                            searchClient={this.props.itemCardClient}
                            item={this.state.item}
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


