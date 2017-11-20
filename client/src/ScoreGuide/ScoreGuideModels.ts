import { get, ItemsSearchModel, ItemCardModel, AboutItemModel } from "@osu-cass/sb-components";

export const itemSearchModelClient = () =>
    get<ItemsSearchModel>("http://is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel");

export const itemCardClient = () =>
    get<ItemCardModel[]>("api/search");

export const aboutitemClient = () =>
    get<AboutItemModel>("api/search");

