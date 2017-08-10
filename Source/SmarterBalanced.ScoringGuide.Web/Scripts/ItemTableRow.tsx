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
                <td className="ItemNumber">{card.itemKey}</td>
                <td className="Claim">{card.claimLabel}/{card.target}</td>
                <td className="Subject">{card.subjectLabel}</td>
                <td className="Grade">{card.gradeLabel}</td>
                <td className="ItemType">{card.interactionTypeLabel}</td>
            </tr>
        );
    }
}