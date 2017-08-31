import * as React from 'react'
import { QuestionTableData } from "../models";
import * as ItemTable from './question-data-table';

interface Props {
    tableData: QuestionTableData;
    title: string
}

export class Component extends React.Component<Props, undefined> {
    render() {
        return (
            <div className='item-page'>
                <ItemTable.Component tableData={this.props.tableData} />
            </div>
        );
    }
}