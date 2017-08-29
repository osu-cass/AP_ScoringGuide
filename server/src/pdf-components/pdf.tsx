import * as React from 'react';
import { ItemMetadata } from '../models';
import * as Header from './header';
import * as ItemPage from './item-page';
interface Props {
    items: ItemMetadata[];
}

export class Component extends React.Component<undefined, undefined> {
    render() {
        let itemData = {
            item: 'item',
            claim: 'claim',
            domain: 'domain',
            target: 'target',
            depthOfKnowledge: 'depth',
            ccssMc: 'ccss mc',
            ccssMp: 'ccss mp'
        }
        const port = process.env.PORT || 3000;
        return (
            <html>
                <head>
                    <base href={'http://localhost:' + port} />
                    <link rel='stylesheet' href='css/pdf.css' />
                </head>
                <body>
                    <table className='full-width'>
                        <thead>
                            <tr>
                                <td>
                                    <Header.Component title='Grade 4 Math' />
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <ItemPage.Component tableData={itemData} />
                            <ItemPage.Component tableData={itemData} />
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    this is the footer!
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </body>
            </html>
        );
    }
}

