import * as Path from 'path';
import * as FileStructure from 'fs';
const puppeteer = require('puppeteer');
const pageWidth = 640;

export interface PicturePath {
    item: string,
    path: string,
    type: PictureType
}

export interface ItemPictures {
    passage: PicturePath,
    questions: PicturePath[]
}

export enum PictureType {
    question,
    passage
}

export interface ScreenshotOptions {
    screenshotPath?: string,
    pageWidth?: number
}

export class ItemCapture {
    browser: any;
    pageWidth: number;
    screenshotPath: string;

    constructor(chromePort: number, options?: ScreenshotOptions) {
        this.browser = puppeteer.connect({
            browserWSEndpoint: 'localhost:' + chromePort
        });
        if (!options) {
            this.pageWidth = options.pageWidth || 640;
            this.screenshotPath = options.screenshotPath || 'screenshots/'
        }
    }

    async takeScreenshots(itemIds: string[]) {
        let pictures: ItemPictures
        const page = await this.browser.newPage();
        
        const idsString = itemIds.join(',');
        await page.goto('http://ivs.smarterbalanced.org/items?ids=' + idsString + '&isaap=TDS_SLM1');
        await page.setViewport({
            width: pageWidth,
            height: 1000
        });
        const iframe = await page.frames()[1];
        await iframe.waitForSelector('.grouping', {
            timeout: 5000
        });
        
        const groupingHeight: number = await iframe.evaluate(() => {
            return document.querySelector('.grouping').clientHeight;
        });
        const headerHeight: number = await iframe.evaluate(() => {
            return document.querySelector('#topBar').scrollHeight;
        });
    
        await page.setViewport({
            width: pageWidth,
            height: groupingHeight + headerHeight
        });
    
        //passage
        const passageRect = await iframe.evaluate(() => {
            let rect = document.querySelector('.thePassage').getBoundingClientRect();
            return {
                x: scrollX + rect.left, 
                y: scrollY + rect.top,
                width: rect.width,
                height: rect.height
            }
        });
        if (!FileStructure.existsSync(this.screenshotPath)) {
            FileStructure.mkdirSync(this.screenshotPath); 
        }
        const passagePath = Path.join(this.screenshotPath, itemIds[0] + '-passage.png');
        await page.screenshot({
            path: 'screenshots/passage.png',
            clip: passageRect
        });

        pictures = {
            passage: {
                item: itemIds[0],
                path: passagePath,
                type: PictureType.passage
            },
            questions: []
        }
    
        // items
        const itemRects = await iframe.evaluate(() => {
            const elements = document.querySelector('.theQuestions').children;
            let rects = [];
            for (let i = 1; i < elements.length; i++) {
                const boundingClientRect = elements[i].getBoundingClientRect();
                var rect = {
                    x: scrollX + boundingClientRect.left,
                    y: scrollY + boundingClientRect.top,
                    width: boundingClientRect.width,
                    height: boundingClientRect.height,
                    item: elements[i].id
                };
                rects.push(rect);
            }
            return rects;
        });
    
        for (let i = 0; i < itemRects.length; i++) {
            const questionPath = Path.join(this.screenshotPath, itemIds[i] + '-question.png');
            await page.screenshot({
                path: questionPath,
                clip: itemRects[i]
            });
            pictures.questions.push({
                item: itemIds[i],
                path: questionPath,
                type: PictureType.question
            });
        }
        return pictures;
    }
}
