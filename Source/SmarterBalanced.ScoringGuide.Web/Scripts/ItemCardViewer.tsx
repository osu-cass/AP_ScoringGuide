import * as React from 'react';
import * as Rubric from './Rubric';
import * as AboutItem from './AboutItem';

export type Tab = "viewer" | "rubric" | "information";

export interface Props extends AboutItem.AboutThisItem {
}

export interface State {
    selectedTab: Tab;
}

export class ItemCardViewer extends React.Component<Props, State> {
    onClick(tab: Tab) {
        this.setState({
            selectedTab: "rubric"
        })
    }

    renderTabs() {
        return (
            <div className="tabs">
                <div className="item-viewer-tab">Item Viewer</div>
                <div className="rubric-tab">Rubric and Exemplar</div>
                <div className="information-tab">Item Information</div>
            </div>
        );
    }

    renderChosen() {
        if (this.state.selectedTab == "viewer") {
            return (
                <div></div>
            );
        }
        else if (this.state.selectedTab == "rubric") {
            const rubrics = this.props.rubrics.map((ru, i) => <Rubric.RubricComponent {...ru } key= { String(i) }/>)
            return (
                <div></div>
                //<div><Rubric.RubricEntryComponent/></div>
            );
        }
        else if (this.state.selectedTab == "information") {
            return (
                <div></div>
            );
        }
    }

    render() {
        return (
            <div className="item-card">
                {this.renderTabs()}
            </div>
        );
    }
}