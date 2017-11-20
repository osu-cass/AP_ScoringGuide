import { get, ItemsSearchModel, ItemCardModel, ItemModel, AboutItemModel } from "@osu-cass/sb-components";

export const itemSearchModelClient = () =>
    get<ItemsSearchModel>("http://is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel");

export const itemCardClient = () =>
    get<ItemCardModel[]>("api/search");

export const aboutItemClient = (params: ItemModel) =>
    get<AboutItemModel>("/api/aboutItem", params)

