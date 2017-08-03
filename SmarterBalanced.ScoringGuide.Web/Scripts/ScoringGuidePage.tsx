import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ItemViewerFrame from './ItemViewerFrame';

export class ScoringGuidePage extends React.Component {
    render() {
        return (
            <ItemViewerFrame.ItemFrame url="http://ivs.smarterbalanced.org/items?ids=187-1437" />
        );
    }
}

export function initializePage() {
    const container = document.getElementById("react-page-container");
    ReactDOM.render(<ScoringGuidePage />, container)
}