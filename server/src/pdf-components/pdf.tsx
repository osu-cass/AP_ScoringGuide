import * as React from 'react';
import { ItemMetadata } from '../models';
import * as Header from './header';

interface Props {
    items: ItemMetadata[];
}

export class Component extends React.Component<undefined, undefined> {
    render() {
        let pageData: JSX.Element[] = [];
        for (let i = 0; i < 100; i++) {
            pageData.push(
                <tr>
                    <td>{i}</td>
                </tr>
            );
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
                            {pageData}
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

