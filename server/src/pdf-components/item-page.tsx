import * as React from 'react'
import { QuestionTableData } from "../models";
import * as ItemTable from './question-data-table';
import * as Header from './header';

interface Props {
    tableData: QuestionTableData;
    title: string
}

export class Component extends React.Component<Props, undefined> {
    render() {
        return (
            <div className='item-page'>
                <Header.Component title={this.props.title} />
                <ItemTable.Component tableData={this.props.tableData} />
            </div>
        );
    }
}