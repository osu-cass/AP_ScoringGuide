import { get, ItemsSearchModel, ItemCardModel, ItemModel, AboutItemModel, AdvancedFilterCategoryModel, FilterType, GradeLevels, GradeLevel, FilterOptionModel, ItemsSearchFilterModel, BasicFilterCategoryModel, SearchAPIParamsModel, ItemSearch, OptionTypeModel } from "@osu-cass/sb-components";

export const itemSearchModelClient = () =>
    get<ItemsSearchModel>("http://is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel");

export const itemCardClient = () =>
    get<ItemCardModel[]>("api/search");

export const aboutItemClient = (params: ItemModel) =>
    get<AboutItemModel>("/api/aboutItem", params)

export const searchFilterModel = () => 
    get<ItemsSearchFilterModel>("api/filterSearchModel");

export function getFilterCategories(itemSearchFilter: ItemsSearchFilterModel): BasicFilterCategoryModel[] {
    const subjects = {...ItemSearch.filterSearchToCategory(itemSearchFilter.subjects), type: OptionTypeModel.DropDown}
    itemSearchFilter.grades.filterOptions = [GradeLevels.Grade3, GradeLevels.Grade4, GradeLevels.Grade5, GradeLevels.Grade6, GradeLevels.Grade7, GradeLevels.Grade8, GradeLevels.High];
    const grades = {...ItemSearch.filterSearchToCategory(itemSearchFilter.grades), type: OptionTypeModel.DropDown}
    const techTypes = {...ItemSearch.filterSearchToCategory(itemSearchFilter.technologyTypes), type: OptionTypeModel.DropDown}

    return [subjects, grades, techTypes];
}