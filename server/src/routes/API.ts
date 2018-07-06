import * as path from 'path';
import * as Express from 'express';
import * as PdfGenerator from '../PdfGenerator';
import { ItemCapture } from '../ItemCapture';
import { ItemDataManager } from '../ItemDataManager';
import * as RequestPromise from '../RequestPromise';
import { ApiRepo } from '../ApiRepo';
import { GradeLevel, SearchAPIParamsModel, SearchUrl, ItemModel } from '@osu-cass/sb-components';

export class APIRoute {
  routes: Express.Router;
  repo: ApiRepo;

  constructor() {
    this.repo = new ApiRepo();
    this.routes = Express.Router();
    this.routes.post('/pdf/items', this.getPdfById);
    this.routes.get('/pdf', this.getPdf);
    this.routes.get('/search', this.search);
    this.routes.get('/aboutItem', this.getAboutItem);
    this.routes.get('/filterSearchModel', this.getFilterSearchModel);
  }

  /**
   * `GET /api/pdf`
   *
   * Generate PDF of items matching `SearchAPIParamsModel` query.
   *
   * URL Params:
   * - titlePage - display title page? defaults to true
   * - scoringInfo - display scoring info for each item? defaults to true
   * - fields in `SearchAPIParamsModel`
   */
  getPdf = (req: Express.Request, res: Express.Response) => {
    const searchParams = SearchUrl.decodeExpressQuery(req.query);
    const titlePage = ((req.query.TitlePage as string) || 'true') === 'true';
    const showRubric = ((req.query.ScoringInfo as string) || 'true') === 'true';

    if (!searchParams.subjects || !searchParams.subjects[0] || !searchParams.gradeLevels) {
      res.status(400).send('Invalid subject or grade.');
    }

    if (!searchParams.catOnly && !searchParams.performanceOnly) {
      res.status(400).send('Invalid tech type.');
    }

    const gradeString = GradeLevel.gradeLevelToString(searchParams.gradeLevels);
    const subjectPromise = this.repo.getSubjectByCode(searchParams.subjects[0]);
    const pdfDataPromise = this.repo.getPdfDataByFilter(searchParams);

    Promise.all([subjectPromise, pdfDataPromise])
      .then(value => {
        const subjectString = value[0].label;
        const htmlString = PdfGenerator.renderBody(
          value[1],
          subjectString,
          gradeString,
          titlePage,
          showRubric
        );
        const title = `${gradeString} ${subjectString}`;
        res.type('application/pdf');
        PdfGenerator.generate(htmlString, title).pipe(res);
      })
      .catch(error => {
        console.error('/api/pdf:', error);
        res.sendStatus(500);
      });
  };

  /**
   * `POST /api/pdf/items`
   *
   * Generate PDF of items specified in body of request
   *
   * URL Params:
   * - assoc - display related items for perforance items? defaults to false
   * - scoringInfo - display scoring info for each item? defaults to true
   *
   * Body Params:
   * - items - array of `ItemModel`s to have in PDF
   */
  getPdfById = (req: Express.Request, res: Express.Response) => {
    const ids = req.body.items;
    const assoc = (req.query.Assoc as string) || 'false';
    const printAssoc = assoc.toLowerCase() === 'true';
    const showRubric = ((req.query.ScoringInfo as string) || 'true') === 'true';

    if (ids.length > 0) {
      const requestedIds = ids.map((id: ItemModel) => `${id.bankKey}-${id.itemKey}`);
      this.repo
        .getPdfDataByIds(requestedIds, printAssoc)
        .then(itemViews => {
          const htmlString = PdfGenerator.renderBody(itemViews, '', '', false, showRubric);
          res.type('application/pdf');
          PdfGenerator.generate(htmlString, 'Custom Item Sequence').pipe(res);
        })
        .catch(error => {
          console.error('/api/pdf:', error);
          res.sendStatus(500);
        });
    } else {
      res.sendStatus(400);
    }
  };

  /**
   * `GET /api/search`
   *
   * Gets all `ItemCardModel`s to display search results to user. Does not actually do
   * any filtering. This is expected to be done on the client side.
   */
  search = (req: Express.Request, res: Express.Response) => {
    this.repo
      .getItemData()
      .then(searchResult => {
        res.type('application/json');
        res.send(JSON.stringify(searchResult));
      })
      .catch(err => {
        console.error('/api/search/:', err);
        res.sendStatus(500);
      });
  };

  /**
   * `GET /api/aboutItem`
   *
   * Get `AboutItemModel` for a specific item
   *
   * URL Params:
   * - itemKey - key of item to get metadata for
   * - itemBank - bank number of item to get metadata for
   */
  getAboutItem = (req: Express.Request, res: Express.Response) => {
    const itemKey = Number(req.query.itemKey || 0) || 0;
    const bankKey = Number(req.query.bankKey || 0) || 0;

    this.repo
      .getAboutItem(itemKey, bankKey)
      .then(about => {
        if (about) {
          res.type('application/json');
          res.send(JSON.stringify(about));
        } else {
          res.sendStatus(400);
        }
      })
      .catch(err => {
        console.error(`/api/aboutItem for ${bankKey}-${itemKey}:`, err);
        res.sendStatus(500);
      });
  };

  /**
   * `GET /api/filterSearchModel`
   *
   * Get `ItemsSearchFilterModel` to help client show options for filtering items
   */
  getFilterSearchModel = (req: Express.Request, res: Express.Response) => {
    this.repo
      .getFilterSearchModel()
      .then(model => {
        res.type('application/json');
        res.send(JSON.stringify(model));
      })
      .catch(err => {
        console.error('/api/filterSearchModel:', err);
        res.sendStatus(500);
      });
  };
}
