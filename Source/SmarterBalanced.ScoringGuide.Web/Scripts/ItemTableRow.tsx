import * as React from 'react';
import * as GradeLevels from './GradeLevels';

export interface ItemTableRowViewModel {
    bankKey: number;
    itemKey: number;
    grade: GradeLevels.GradeLevels;
    gradeLabel: string;
    subjectCode: string;
    subjectLabel: string;
    claimLabel: string;
    target: string;
    interactionTypeLabel: string;
}

export function itemPageLink(bankKey: number, itemKey: number) {
    window.location.href = "/Item/Details?bankKey=" + bankKey + "&itemKey=" + itemKey;
}

export class ItemTableRow extends React.Component<ItemTableRowViewModel, {}> {

    handleKeyPress(bankKey: number, itemKey: number, e: React.KeyboardEvent<HTMLElement>) {
        if (e.keyCode === 13 || e.keyCode === 23) {
            itemPageLink(bankKey, itemKey);
        }
    }

    render() {
        const { bankKey, itemKey } = this.props;
        return (
            <tr className={this.props.subjectCode.toLowerCase()}
                onClick={e => itemPageLink(bankKey, itemKey)}
                onKeyUp={e => this.handleKeyPress(bankKey, itemKey, e)}
                tabIndex={0}>
                <td>{this.props.itemKey}</td>
                <td>{this.props.claimLabel}/{this.props.target}</td>
                <td>{this.props.subjectLabel}</td>
                <td>{this.props.gradeLabel}</td>
                <td>{this.props.interactionTypeLabel}</td>
            </tr>
        );
    }
}