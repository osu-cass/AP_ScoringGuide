import * as React from 'react';
import * as GradeLevels from './GradeLevels';
import * as ItemCard from './ItemCard';


export interface Props {
    onClick(item: ItemCard.ItemCardViewModel): void;
    itemCard: ItemCard.ItemCardViewModel;

}

export class ItemTableRow extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    handleKeyPress(e: React.KeyboardEvent<HTMLElement>) {
        if (e.keyCode === 13 || e.keyCode === 23) {
            this.props.onClick(this.props.itemCard);
        }
    }

    render() {
        const card = this.props.itemCard;
        return (
            <tr className={card.subjectCode.toLowerCase()}
                onClick={() => this.props.onClick(card)}
                onKeyUp={(e) => this.handleKeyPress(e)}
                tabIndex={0}>
                <td>{card.itemKey}</td>
                <td>{card.claimLabel}/{card.target}</td>
                <td>{card.subjectLabel}</td>
                <td>{card.gradeLabel}</td>
                <td>{card.interactionTypeLabel}</td>
            </tr>
        );
    }
}