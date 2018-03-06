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
    OptionTypeModel
} from "@osu-cass/sb-components";


export const pdfURLPost = ( params: string ) => {
    return postRequest( `api/pdf${ params }` );
};

export const pdfBodyPost = ( params: ItemModel[] ) => {
    return postRequest( "api/pdf/items", params );
};

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