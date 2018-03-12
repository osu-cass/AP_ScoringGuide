import {
    getRequest,
    postRequest,
    ItemsSearchModel,
    ItemCardModel,
    ItemModel,
    AboutItemModel,
    AdvancedFilterCategoryModel,
    FilterType,
    GradeLevels,
    GradeLevel,
    FilterOptionModel,
    ItemsSearchFilterModel,
    BasicFilterCategoryModel,
    SearchAPIParamsModel,
    ItemSearch,
    OptionTypeModel,
    SearchUrl
} from "@osu-cass/sb-components";

/**
 * `GET` PDF based on search params
 * @param searchParams search params object
 * @param showTitlePage include title page in  PDF? defaults to true
 * @param showScoringInfo include scoring info in PDF? defaults to true
 */
export const pdfSearchParams = (
    searchParams: SearchAPIParamsModel,
    showTitlePage = true,
    showScoringInfo = true
): Promise<Blob> => {
    let paramsString = SearchUrl.encodeQuery(searchParams);
    paramsString += `&titlePage=${showTitlePage}&scoringInfo=${showScoringInfo}`;

    return getRequest<Blob>(`api/pdf${paramsString}`, undefined, "blob");
};

/**
 * `POST` request for PDF given specific item IDs
 * @param itemsToPrint Items to display in PDF
 * @param includeAssociatedItems Display associated items in PDF? defaults to false
 * @param showScoringInfo Display scoring info in PDF? defaults to true
 */
export const pdfItemSequence = (
    itemsToPrint: ItemModel[],
    includeAssociatedItems = false,
    showScoringInfo = true
): Promise<Blob> => {
    const url = `api/pdf/items?assoc=${includeAssociatedItems}&scoringInfo=${showScoringInfo}`;

    return postRequest<Blob>(url, itemsToPrint, "blob");
};

export function downloadPdf(pdfData: Blob) {
    const now = new Date();
    const fileName = `Scoring_Guide${now.getMonth()}-${now.getDay()}-${now.getFullYear()}_${now.getHours()}:${now.getMinutes()}.pdf`;
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(pdfData);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
}

export const itemSearchModelClient = () =>
    getRequest<ItemsSearchModel>( "is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel" );

export const itemCardClient = () =>
    getRequest<ItemCardModel[]>( "api/search" );

export const aboutItemClient = ( params: ItemModel ) =>
    getRequest<AboutItemModel>( "/api/aboutItem", params );

export const searchFilterModel = () =>
    getRequest<ItemsSearchFilterModel>( "api/filterSearchModel" );

export function getBasicFilterCategories (
    itemSearchFilter: ItemsSearchFilterModel,
    searchParams: SearchAPIParamsModel
): BasicFilterCategoryModel[] {
    const subjects = {
        ...ItemSearch.filterSearchToCategory(itemSearchFilter.subjects, searchParams),
        optionType: OptionTypeModel.DropDown
    };
    itemSearchFilter.grades.filterOptions = [
        GradeLevels.Grade3,
        GradeLevels.Grade4,
        GradeLevels.Grade5,
        GradeLevels.Grade6,
        GradeLevels.Grade7,
        GradeLevels.Grade8,
        GradeLevels.High
    ];
    const grades = {
        ...ItemSearch.filterSearchToCategory(itemSearchFilter.grades, searchParams),
        optionType: OptionTypeModel.DropDown
    };
    const techTypes = {
        ...ItemSearch.filterSearchToCategory(itemSearchFilter.technologyTypes, searchParams),
        optionType: OptionTypeModel.DropDown
    };

    return [ subjects, grades, techTypes ];
}

export function getAdvancedFilterCategories(
    itemSearchFilter: ItemsSearchFilterModel,
    searchAPI: SearchAPIParamsModel
): AdvancedFilterCategoryModel[] {

    const claims = {
        ...ItemSearch.filterSearchToCategory(itemSearchFilter.claims, searchAPI),
        isMultiSelect: true,
        disabled: false,
        displayAllButton: true
    };

    const interactions = {
        ...ItemSearch.filterSearchToCategory(
            itemSearchFilter.interactionTypes,
            searchAPI
        ),
        isMultiSelect: true,
        disabled: false,
        displayAllButton: true
    };

    const techTypes = {
        ...ItemSearch.filterSearchToCategory(
            itemSearchFilter.technologyTypes,
            searchAPI
        ),
        isMultiSelect: false,
        disabled: false,
        displayAllButton: true
    };

    const targets = {
        ...ItemSearch.filterSearchToCategory(itemSearchFilter.targets, searchAPI),
        isMultiSelect: true,
        disabled: false,
        displayAllButton: true
    };

    const calculator = {
        ...ItemSearch.filterSearchToCategory(
            itemSearchFilter.calculator,
            searchAPI
        ),
        isMultiSelect: false,
        disabled: false,
        displayAllButton: true
    };

    return [
        claims,
        interactions,
        techTypes,
        targets,
        calculator
    ];
}

export function getItemSearchModel(
    itemSearchFilter: ItemsSearchFilterModel
): ItemsSearchModel {
    return {
        claims: itemSearchFilter.claims.filterOptions,
        subjects: itemSearchFilter.subjects.filterOptions,
        interactionTypes: itemSearchFilter.interactionTypes.filterOptions,
        targets: itemSearchFilter.targets.filterOptions
    };
}