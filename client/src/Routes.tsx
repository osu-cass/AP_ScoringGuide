import * as React from "react";
import { Router, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ScoringGuidePage } from "./ScoreGuide/ScoringGuidePage";
import {
  Layout,
  SbNavlinkProps,
  ItemsSearchModel,
  ItemCardViewer,
  ErrorPageContainer
} from "@osu-cass/sb-components";
import {
  itemCardClient,
  searchFilterModel,
  aboutItemClient
} from "./ScoreGuide/ScoreGuideModels";

const siteLinks: SbNavlinkProps[] = [];

export const routes = (
  <Layout siteName="Score Guide" links={siteLinks}>
    <Switch>
      <Route
        exact
        path="/"
        render={props => (
          <ScoringGuidePage
            {...props}
            itemsSearchFilterClient={searchFilterModel}
            aboutItemClient={aboutItemClient}
            itemCardClient={itemCardClient}
            errorRoute="/error"
          />
        )}
      />

      <Route
        path="/error"
        render={props => (
          <ErrorPageContainer
            {...props}
            description="An error occured while processing your request."
            errorCode={500}
          />
        )}
      />

      <Route
        render={props => <ErrorPageContainer {...props} errorCode={404} />}
      />
    </Switch>
  </Layout>
);
