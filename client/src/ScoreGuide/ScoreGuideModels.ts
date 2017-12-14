import { get, ItemsSearchModel, ItemCardModel, ItemModel, AboutItemModel, AdvancedFilterCategoryModel, FilterType, GradeLevels, GradeLevel, FilterOptionModel, ItemsSearchFilterModel, BasicFilterCategoryModel, SearchAPIParamsModel, ItemSearch, OptionTypeModel } from "@osu-cass/sb-components";

export const itemSearchModelClient = () =>
    get<ItemsSearchModel>("http://is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel");

export const itemCardClient = () =>
    get<ItemCardModel[]>("api/search");

export const aboutItemClient = (params: ItemModel) =>
    get<AboutItemModel>("/api/aboutItem", params);

export const searchFilterModel = () => 
    get<ItemsSearchFilterModel>("api/filterSearchModel");

export function getBasicFilterCategories(itemSearchFilter: ItemsSearchFilterModel, searchParams: SearchAPIParamsModel): BasicFilterCategoryModel[] {
    const subjects = {...ItemSearch.filterSearchToCategory(itemSearchFilter.subjects, searchParams), type: OptionTypeModel.DropDown};
    itemSearchFilter.grades.filterOptions = [GradeLevels.Grade3, GradeLevels.Grade4, GradeLevels.Grade5, GradeLevels.Grade6, GradeLevels.Grade7, GradeLevels.Grade8, GradeLevels.High];
    const grades = {...ItemSearch.filterSearchToCategory(itemSearchFilter.grades, searchParams), type: OptionTypeModel.DropDown};
    const techTypes = {...ItemSearch.filterSearchToCategory(itemSearchFilter.technologyTypes, searchParams), type: OptionTypeModel.DropDown};

    return [subjects, grades, techTypes];
}

export function getAdvancedFilterCategories(itemSearchFilter: ItemsSearchFilterModel, searchParams: SearchAPIParamsModel): AdvancedFilterCategoryModel[] {
    const claims = {...ItemSearch.filterSearchToCategory(itemSearchFilter.claims, searchParams), isMultiSelect: true, displayAllButton: true};
    const interactionTypes = {...ItemSearch.filterSearchToCategory(itemSearchFilter.interactionTypes, searchParams), isMultiSelect: true, displayAllButton: true};
    //const targets = {...ItemSearch.filterSearchToCategory(itemSearchFilter.targets, searchParams), isMultiSelect: true, displayAllButton: true};
    return [claims, interactionTypes];
}

export function getItemSearchModel(itemSearchFilter: ItemsSearchFilterModel): ItemsSearchModel {
    const itemSearch: ItemsSearchModel = {
        claims: itemSearchFilter.claims.filterOptions,
        subjects: itemSearchFilter.subjects.filterOptions,
        interactionTypes: itemSearchFilter.interactionTypes.filterOptions,
        //targets: itemSearchFilter.targets.filterOptions
    };
    return itemSearch;
}