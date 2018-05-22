import * as URL from "url";
import * as RequestPromise from "./RequestPromise";
import {
    ScoreGuideViewModel,
    AboutItemModel,
    ItemsSearchFilterModel
} from "@osu-cass/sb-components";

const { SAMPLE_ITEMS_API, ITEM_VIEWER_SERVICE_API } = process.env;

export const sgViewModelCall: () => Promise<ScoreGuideViewModel> = () => {
    const fullUrl = URL.resolve(
        SAMPLE_ITEMS_API,
        "/ScoringGuide/ScoringGuideViewModel"
    );

    return RequestPromise.getRequest(fullUrl).then(sgvm => JSON.parse(sgvm));
};

export const filterSearchModelCall: () => Promise<ItemsSearchFilterModel> = () => {
    const fullUrl = URL.resolve(
        SAMPLE_ITEMS_API,
        "/BrowseItems/FilterSearchModel"
    );

    return RequestPromise.getRequest(fullUrl).then(fsm => JSON.parse(fsm));
};

export const aboutAllItemsCall: () => Promise<AboutItemModel[]> = () => {
    const fullUrl = URL.resolve(
        SAMPLE_ITEMS_API,
        "/ScoringGuide/AboutAllItems"
    );

    return RequestPromise.getRequest(fullUrl).then(result =>
        JSON.parse(result)
    );
};

export const itemViewCall: (items: string[]) => Promise<string> = (items: string[]) => {
    const fullUrl = URL.resolve(
        ITEM_VIEWER_SERVICE_API,
        "/Pages/API/content/load"
    );
    const postData = {
        items: items.map(i => {
            return { response: "", id: `I-${i}` };
        }),
        accommodations: [] as never[]
    };

    return RequestPromise.postRequest(fullUrl, postData);
};
