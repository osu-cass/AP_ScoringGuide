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
        return $.html();
    }

    /** Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437). */
    async loadItemData(items: string[]) {
        const response = await this.load(items);
        const xmlData = await this.parseXml(response);
        return this.parseHtml(xmlData);
    }
}