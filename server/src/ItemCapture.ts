import * as Path from 'path';
import * as FileStructure from 'fs';
import { ItemGroupModel, ItemPdfModel, PdfViewType } from '@osu-cass/sb-components';
const puppeteer = require('puppeteer');

const { SCREENSHOT_WIDTH } = process.env;

export class ItemCapture {
  browser: any;

  async launchBrowser() {
    this.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    console.log('chrome url: ', this.browser.wsEndpoint());
  }

  getIdString(paths: ItemGroupModel) {
    const ids: string[] = [];
    paths.questions.forEach(p => {
      if (p.view.type === PdfViewType.picture) {
        ids.push(p.id);
      }
    });

    if (ids.length === 0 && paths.passage) {
      ids.push(paths.passage.id);
    }

    return ids.join(',');
  }

  async takeScreenshots(itemData: ItemGroupModel) {
    const page = await this.browser.newPage();
    const idsString = this.getIdString(itemData);
    await page.goto(`http://ivs.smarterbalanced.org/items?ids=${idsString}&isaap=TDS_SLM1`);
    await page.setViewport({
      width: SCREENSHOT_WIDTH,
      height: 1000
    });
    const iframe = await page.frames()[1];
    await iframe.waitForSelector('.grouping', {
      timeout: 5000
    });

    await new Promise(resolve => setTimeout(resolve, 200));

    const headerHeight: number = await iframe.evaluate(() => {
      return document.querySelector('#topBar').scrollHeight;
    });
    const groupingHeight: number = await iframe.evaluate(() => {
      return document.querySelector('.grouping').clientHeight;
    });

    await page.setViewport({
      width: SCREENSHOT_WIDTH,
      height: groupingHeight + headerHeight
    });

    // passage
    if (
      itemData.passage &&
      itemData.passage.type === PdfViewType.picture &&
      !itemData.passage.captured
    ) {
      const passageRect = await iframe.evaluate(() => {
        const passage = document.querySelector('.thePassage');
        const rect = passage.getBoundingClientRect();

        return {
          x: scrollX + rect.left,
          y: scrollY + rect.top,
          width: rect.width,
          height: rect.height
        };
      });

      await page.screenshot({
        path: itemData.passage.picturePath,
        clip: passageRect
      });
      itemData.passage.captured = true;
    }

    // questions
    const itemRects = await iframe.evaluate(() => {
      const headerHeight = document.querySelector('.questionNumber').clientHeight;
      const elements = document.querySelector('.theQuestions').children;
      const rects = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elements.length; i++) {
        const boundingClientRect = elements[i].getBoundingClientRect();
        const rect = {
          x: scrollX + boundingClientRect.left,
          y: scrollY + boundingClientRect.top + headerHeight,
          width: boundingClientRect.width,
          height: boundingClientRect.height - headerHeight,
          itemId: elements[i].id.match(/\d+/)[0]
        };
        rects.push(rect);
      }

      return rects;
    });

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < itemRects.length; i++) {
      const question = itemData.questions.find(q => q.id.includes(itemRects[i].itemId));
      if (!question.view.captured && question.view.type === PdfViewType.picture) {
        await page.screenshot({
          path: question.view.picturePath,
          clip: itemRects[i]
        });
        question.view.captured = true;
      }
    }
    page.close(); // fire and forget

    return itemData;
  }
}
