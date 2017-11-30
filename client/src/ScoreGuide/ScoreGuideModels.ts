import { get, ItemsSearchModel, ItemCardModel, ItemModel, AboutItemModel, AdvancedFilterCategoryModel, FilterType, GradeLevels, GradeLevel, FilterOptionModel, ItemsSearchFilterModel, BasicFilterCategoryModel, SearchAPIParamsModel, ItemSearch, OptionTypeModel } from "@osu-cass/sb-components";

export const itemSearchModelClient = () =>
    get<ItemsSearchModel>("http://is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel");

export const itemCardClient = () =>
    get<ItemCardModel[]>("api/search");

export const aboutItemClient = (params: ItemModel) =>
    get<AboutItemModel>("/api/aboutItem", params)

export const searchFilterModel = () => 
    get<ItemsSearchFilterModel>("api/searchFilterModel");

export function getFilterCategories(itemSearchFilter: ItemsSearchFilterModel): BasicFilterCategoryModel[] {
    const subjects = {...ItemSearch.filterSearchToCategory(itemSearchFilter.subjects), type: OptionTypeModel.DropDown}

    return [subjects];
}