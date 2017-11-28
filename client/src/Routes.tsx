import * as React from 'react';
import { Router, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ScoringGuidePage } from './ScoreGuide/ScoringGuidePage';
import {
    Layout,
    SbNavlinkProps,
    ItemsSearchModel,
    get
} from '@osu-cass/sb-components';
import { itemCardClient, itemSearchModelClient, aboutItemClient } from './ScoreGuide/ScoreGuideModels';

const siteLinks: SbNavlinkProps[] = [
];


export const routes = <Layout siteName="Score Guide" links={siteLinks}>
    <Route exact path='/' render={(props) => (
        <ScoringGuidePage
            {...props}
            scoreGuideViewModelClient={itemSearchModelClient}
            aboutItemClient={aboutItemClient}
            itemCardClient={itemCardClient}
        />
    )} />
    <Route exact path='*' render={(props) => (
        <div>TODO: add error</div>
    )} />

</Layout>;

