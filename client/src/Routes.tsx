import * as React from 'react';
import { Router, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ScoringGuidePage } from './ScoreGuide/ScoringGuidePage';
import {
    Layout,
    SbNavlinkProps,
    ItemsSearchModel
} from '@osu-cass/sb-components';
import { itemCardClient, searchFilterModel, aboutItemClient } from './ScoreGuide/ScoreGuideModels';

const siteLinks: SbNavlinkProps[] = [
];


export const routes = <Layout siteName="Score Guide" links={siteLinks}>
    <Switch>
        <Route exact path='/' render={(props) => (
            <ScoringGuidePage
                {...props}
                itemsSearchFilterClient={searchFilterModel}
                aboutItemClient={aboutItemClient}
                itemCardClient={itemCardClient}
            />
        )} />
        <Route path='*' render={(props) => (
            <div>TODO: add error</div>
        )} />
    </Switch>
</Layout>;

