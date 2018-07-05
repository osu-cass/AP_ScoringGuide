import { ItemDataManager } from "./ItemDataManager";
import * as URL from "url";
import * as RequestPromise from "./RequestPromise";
import {
  AboutItemModel,
  ItemCardModel,
  SubjectModel,
  ItemGroupModel,
  PdfViewType,
  SearchAPIParamsModel,
  ItemSearch,
  ItemsSearchFilterModel
} from "@osu-cass/sb-components";

const { SCREENSHOT_WIDTH, SAMPLE_ITEMS_API } = process.env;

export class ApiRepo {
  manager: ItemDataManager;
  itemCards: ItemCardModel[];
  aboutItems: AboutItemModel[];
  subjects: SubjectModel[];
  filterSearchModel: ItemsSearchFilterModel;

  constructor() {
    this.manager = new ItemDataManager();
  }

  /**
   * Load `ScoringGuideViewModel` from API, cache the subjects object from it.
   * Call this if we don't already have subjects cached. Typically, we want to
   * call `getSubjects()` instead of this.
   */
  private async loadSubjectsFromSiw() {
    const fullUrl = URL.resolve(
      SAMPLE_ITEMS_API,
      "/ScoringGuide/ScoringGuideViewModel"
    );
    const subjects = await RequestPromise.getRequest(fullUrl);
    this.subjects = JSON.parse(subjects).subjects.map(
      (s: { code: number; label: string; shortLabel: string }) => {
        return {
          code: s.code,
          label: s.label,
          shortLabel: s.shortLabel
        };
      }
    );
  }

  /**
   * Load `ItemsSearchFilterModel` from the API
   */
  public async getFilterSearchModel() {
    if (!this.filterSearchModel) {
      const fullUrl = URL.resolve(
        SAMPLE_ITEMS_API,
        "/BrowseItems/FilterSearchModel"
      );
      const modelString = await RequestPromise.getRequest(fullUrl);
      this.filterSearchModel = JSON.parse(modelString);
    }

    return this.filterSearchModel;
  }

  /**
   * Load `AboutItemModel`s from API, use that data to get `ItemCardModel`s
   */
  private async loadDataFromSiw() {
    const fullUrl = URL.resolve(
      SAMPLE_ITEMS_API,
      "/ScoringGuide/AboutAllItems"
    );
    const items = await RequestPromise.getRequest(fullUrl);
    this.aboutItems = JSON.parse(items);
    this.itemCards = this.aboutItems.map(i => i.itemCardViewModel);
  }

  /**
   * Returns a array of string arrays, each containing an item's associated items. The associated
   * items are each elements of the corresponding string array. Note that the mapped string array
   * will also contain the given item id.
   *
   * @param {string[]} requestedIds
   */
  public async getAssociatedItems(requestedIds: string[]) {
    const idsArray: string[] = [];
    const aboutItems = await this.getAboutAllItems();
    requestedIds.forEach(reqId => {
      const item = aboutItems.find(ai => ai.associatedItems.includes(reqId));
      if (item && !idsArray.includes(item.associatedItems)) {
        idsArray.push(item.associatedItems);
      }
    });

    return idsArray.map(idGroup => idGroup.split(","));
  }

  /**
   * Adds `AboutItemData` and question number to each item in the `itemViews` array.
   * @param itemViews view models that data gets added to
   */
  async addDataToViews(itemViews: ItemGroupModel[]) {
    let questionNum = 1;
    const aboutItems = await this.getAboutAllItems();
    itemViews.forEach(iv =>
      iv.questions.forEach(q => {
        q.data = aboutItems.find(
          item =>
            item.itemCardViewModel &&
            `${item.itemCardViewModel.bankKey}-${
              item.itemCardViewModel.itemKey
            }` === q.id
        );
        q.questionNumber = questionNum += 1;
      })
    );
  }
  /**
   * Loads HTML and, if needed, screenshots of items.Takes an array of string arrays,
   * each of which should be an item Id or group of performance Ids.
   * @param {string[][]} itemIds
   */
  async loadViewData(itemIds: string[][]) {
    return Promise.all(
      itemIds.map(idGroup => this.manager.getItemData(idGroup))
    );
  }

  async getItemData() {
    if (!this.itemCards) {
      await this.loadDataFromSiw();
    }

    return this.itemCards;
  }

  async getSubjects() {
    if (!this.subjects) {
      await this.loadSubjectsFromSiw();
    }

    return this.subjects;
  }

  /**
   * Find the `AboutItemModel` that corresponds to the given item and bank keys.
   *
   * @param {number} itemKey
   * @param {number} bankKey
   */
  async getAboutItem(itemKey: number, bankKey: number) {
    if (!this.aboutItems) {
      await this.loadDataFromSiw();
    }

    return this.aboutItems.find(
      i =>
        i.itemCardViewModel &&
        i.itemCardViewModel.itemKey === itemKey &&
        i.itemCardViewModel.bankKey === bankKey
    );
  }

  private async getAboutAllItems() {
    if (!this.aboutItems) {
      await this.loadDataFromSiw();
    }

    return this.aboutItems;
  }

  /**
   * Given an array of item ids, return a corresponding array of `ItemGroupModel`s including the view data for each item and its metadata.
   *
   * @param {string[]} requestedIds Array of item ids of the form `BANK-ITEM`
   * @param {boolean} printAssoc Include associated items? (performance items)
   */
  async getPdfDataByIds(requestedIds: string[], printAssoc: boolean) {
    let idGroups: string[][];
    if (printAssoc) {
      idGroups = await this.getAssociatedItems(requestedIds);
    } else {
      idGroups = requestedIds.map(id => [id]);
    }
    const views = await this.loadViewData(idGroups);
    await this.addDataToViews(views);

    return views;
  }

  async getSubjectByCode(code: string) {
    const subjects = await this.getSubjects();

    return subjects.find(s => s.code === code);
  }

  /**
   * Filter `AboutItemModel`s down based on the `SearchAPIParamsModel` using `ItemSearch.filterItemCards() and return the result`
   *
   * @param {SearchAPIParamsModel} filter
   */
  private async getAboutItemsByFilter(filter: SearchAPIParamsModel) {
    const allItems = await this.getItemData();
    const filteredItems = ItemSearch.filterItemCards(allItems, filter);
    const aboutAllItems = await this.getAboutAllItems();

    return filteredItems.map(i =>
      aboutAllItems.find(
        ai =>
          ai.itemCardViewModel &&
          ai.itemCardViewModel.itemKey === i.itemKey &&
          ai.itemCardViewModel.bankKey === i.bankKey
      )
    );
  }

  /** Filter down items based on given filter, then return a array of `ItemGroupModel`s including the view data for filtered items and its metadata.
   *
   * @param {SearchAPIParamsModel} filter
   */
  async getPdfDataByFilter(filter: SearchAPIParamsModel) {
    const aboutItems = await this.getAboutItemsByFilter(filter);
    const associatedItems: string[] = [];
    aboutItems.forEach(ai => {
      if (!associatedItems.includes(ai.associatedItems)) {
        associatedItems.push(ai.associatedItems);
      }
    });

    const idGroups = associatedItems.map(ai => ai.split(","));
    let views = await this.loadViewData(idGroups);
    views = this.combineLikePassages(views);
    await this.addDataToViews(views);

    return views;
  }

  /**
   * Finds all items with the same passage and combines the items into one passage with multiple questions
   */
  private combineLikePassages(itemGroups: ItemGroupModel[]) {
    const combinedItems: ItemGroupModel[] = [];
    let addedIds: string[] = [];

    for (const item of itemGroups) {
      if (item.passage) {
        const samePassageItems = itemGroups.filter(
          (ig, filterIdx) =>
            ig.passage &&
            ig.passage.type === PdfViewType.html &&
            ig.passage.html === item.passage.html
        );
        const samePassageQuestions = samePassageItems
          .map(ig => ig.questions)
          .reduce((prev, curr) => prev.concat(curr), []);
        if (
          samePassageQuestions
            .map(q => addedIds.includes(q.id))
            .every(bool => !bool)
        ) {
          combinedItems.push({
            passage: item.passage,
            questions: samePassageQuestions
          });
          addedIds = addedIds.concat(samePassageQuestions.map(q => q.id));
        }
      } else {
        combinedItems.push(item);
      }
    }

    return combinedItems;
  }
}
