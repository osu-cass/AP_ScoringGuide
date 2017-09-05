import * as Request from 'request';
import * as Xml from 'xml2js';
import * as Cheerio from 'cheerio';

export class ItemParser {

    /** Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437). */
    load(items: string[]) {
        let postData = {
            items: items.map(i => {
                return { response: '', id: 'I-' + i }
            }),
            accommodations: [] as any[]
        }
        return new Promise<string>((resolve, reject) => {
            Request.post('http://ivs.smarterbalanced.org/Pages/API/content/load', {
                json: postData,
                headers: {
                    "Accept": "",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
                }
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    }

    parseXml(xmlString: string) {
        return new Promise<string>((resolve, reject) => {
            Xml.parseString(xmlString, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        });
    }

    parseHtml(xmlObject: any) {
        let htmlString = xmlObject.contents.content[0].html[0] as string;
        let $ = Cheerio.load(htmlString);
        $('a').remove();
        $('img').map((i, el) => {
            el.attribs['src'] = 'http://ivs.smarterbalanced.org' + el.attribs['src'];
        });

        this.shouldTakePicture($('.thePassage')) 
            ? console.log('Take picture for passage') 
            : console.log('Dont take picture for passage');

        let questionsParent = $('.theQuestions').children().eq(0);
        $(questionsParent).children().each((i, el) => {
            this.shouldTakePicture($(el)) 
                ? console.log('Take picture for question ', el.attribs['id']) 
                : console.log('Dont take picture for question', el.attribs['id']);
        });
        
        return $.html();
    }

    shouldTakePicture(element: Cheerio) {
        let initializing = element.find('span').filter((i, el) => {
            if (el.children[0]) {
                return (el.children[0] as any).data === 'Initializing';
            }
            return false;
        }).length;
        return initializing !== 0;
    }

    /** Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437). */
    async loadItemData(items: string[]) {
        const response = await this.load(items);
        const xmlData = await this.parseXml(response);
        return this.parseHtml(xmlData);
    }
}

