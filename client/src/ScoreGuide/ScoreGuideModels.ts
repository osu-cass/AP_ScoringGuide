import {
  getRequest,
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
  SearchUrl,
  downloadPdfGet,
  downloadPdfPost
} from '@osu-cass/sb-components';

/**
 * `GET` PDF based on search params
 * @param searchParams search params object
 * @param showTitlePage include title page in  PDF? defaults to true
 * @param showScoringInfo include scoring info in PDF? defaults to true
 */
export const pdfSearchParams = async (
  searchParams: SearchAPIParamsModel,
  showTitlePage = true,
  showScoringInfo = true
): Promise<{}> => {
  let paramsString = SearchUrl.encodeQuery(searchParams);
  paramsString += `&titlePage=${showTitlePage}&scoringInfo=${showScoringInfo}`;

  return downloadPdfGet(`api/pdf${paramsString}`);
};

/**
 * `POST` request for PDF given specific item IDs
 * @param itemsToPrint Items to display in PDF
 * @param includeAssociatedItems Display associated items in PDF? defaults to false
 * @param showScoringInfo Display scoring info in PDF? defaults to true
 */
export const pdfItemSequence = async (
  itemsToPrint: ItemModel[],
  includeAssociatedItems = false,
  showScoringInfo = true
): Promise<{}> => {
  const url = `api/pdf/items?assoc=${includeAssociatedItems}&scoringInfo=${showScoringInfo}`;

  return downloadPdfPost(url, itemsToPrint);
};

export const itemSearchModelClient = async () =>
  getRequest<ItemsSearchModel>('is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel');

export const itemCardClient = async () => getRequest<ItemCardModel[]>('api/search');

export const aboutItemClient = async (params: ItemModel) =>
  getRequest<AboutItemModel>('/api/aboutItem', params);

export const searchFilterModel = async () =>
  getRequest<ItemsSearchFilterModel>('api/filterSearchModel');

export function getBasicFilterCategories(
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

  return [subjects, grades, techTypes];
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
    ...ItemSearch.filterSearchToCategory(itemSearchFilter.interactionTypes, searchAPI),
    isMultiSelect: true,
    disabled: false,
    displayAllButton: true
  };

  const techTypes = {
    ...ItemSearch.filterSearchToCategory(itemSearchFilter.technologyTypes, searchAPI),
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
    ...ItemSearch.filterSearchToCategory(itemSearchFilter.calculator, searchAPI),
    isMultiSelect: false,
    disabled: false,
    displayAllButton: true
  };

  return [claims, interactions, techTypes, targets, calculator];
}

export function getItemSearchModel(itemSearchFilter: ItemsSearchFilterModel): ItemsSearchModel {
  return {
    claims: itemSearchFilter.claims.filterOptions,
    subjects: itemSearchFilter.subjects.filterOptions,
    interactionTypes: itemSearchFilter.interactionTypes.filterOptions,
    targets: itemSearchFilter.targets.filterOptions
  };
}
