import * as Path from 'path';
import * as FileStructure from 'fs';
import { PicturePath, ItemPictures, PictureType } from './models';
const puppeteer = require('puppeteer');

export interface ScreenshotOptions {
    screenshotPath?: string,
    pageWidth?: number
}

export class ItemCapture {
    browser: any;
    pageWidth = 640;
    screenshotPath = 'screenshots/';

    constructor(options?: ScreenshotOptions) {
        // this.browser = puppeteer.connect({
        //     browserWSEndpoint: 'ws://localhost:' + chromePort
        // });
        if (options) {
            this.pageWidth = options.pageWidth || 640;
            this.screenshotPath = options.screenshotPath || 'screenshots/'
        }
    }

    async launchBrowser(){
        this.browser = await puppeteer.launch();
        console.log('chrome url: ', this.browser.wsEndpoint());
    }

    async takeScreenshots(itemIds: string[]) {
        let pictures: ItemPictures
        const page = await this.browser.newPage();
        
        const idsString = itemIds.join(',');
        await page.goto('http://ivs.smarterbalanced.org/items?ids=' + idsString + '&isaap=TDS_SLM1');
        await page.setViewport({
            width: this.pageWidth,
            height: 1000
        });
        const iframe = await page.frames()[1];
        await iframe.waitForSelector('.grouping', {
            timeout: 5000
        });

        await new Promise(resolve => setTimeout(resolve, 50));
        
        const headerHeight: number = await iframe.evaluate(() => {
            return document.querySelector('#topBar').scrollHeight;
        });
        const groupingHeight: number = await iframe.evaluate(() => {
            return document.querySelector('.grouping').clientHeight;
        });

        await page.setViewport({
            width: this.pageWidth,
            height: groupingHeight + headerHeight
        });
    
        //passage
        const passageRect = await iframe.evaluate(() => {
            let passage = document.querySelector('.thePassage');
            if (!passage) {
                return undefined;
            }
            let rect = passage.getBoundingClientRect();
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
        if (passageRect) {
            const passagePath = Path.join(this.screenshotPath, itemIds[0] + '-passage.png');
            await page.screenshot({
                path: passagePath,
                clip: passageRect
            });
            pictures = {
                passage: {
                    item: itemIds[0],
                    path: passagePath,
                    type: PictureType.passage,
                    captured: true
                },
                questions: []
            }
        } else {
            pictures = {
                passage: undefined,
                questions: []
            }
        }
        
        // items
        const itemRects = await iframe.evaluate(() => {
            const elements = document.querySelector('.theQuestions').children;
            let rects = [];
            for (let i = 0; i < elements.length; i++) {
                const boundingClientRect = elements[i].getBoundingClientRect();
                var rect = {
                    x: scrollX + boundingClientRect.left,
                    y: scrollY + boundingClientRect.top,
                    width: boundingClientRect.width,
                    height: boundingClientRect.height
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
                type: PictureType.question,
                captured: true
            });
        }
        await page.close();
        return pictures;
    }
}
