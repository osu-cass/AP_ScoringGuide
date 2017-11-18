import * as React from 'react';
import { Router, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { ScoringGuidePage, ItemsSearchViewModel } from './ScoreGuide/ScoringGuidePage';
import "font-awesome/css/font-awesome.min.css";
import './styles/site.less'
import {
    Layout, SbNavlinkProps, ItemsSearchModel, get
} from '@osu-cass/sb-components';

const siteLinks: SbNavlinkProps[] = [
];

const client = () => get<ItemsSearchViewModel>("http://is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel");

export const routes = <Layout siteName="Score Guide" links={siteLinks}>
    <Route exact path='/' render={(props) => (
        <ScoringGuidePage {...props} scoreGuideViewModelClient={client} />
    )} />
    <Route exact path='*' render={(props) => (
        <div>TODO: add error</div>
    )} />

</Layout>;

