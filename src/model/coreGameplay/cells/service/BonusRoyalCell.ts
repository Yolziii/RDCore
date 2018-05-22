import {CellType} from "../CellType";
import {Config} from "../../../Config";
import {IServiceCell} from "../IServiceCell";
import {pointsAsRoyalDice} from "../CellsUtil";
import {ICard} from "../../Card";

export class BonusRoyalCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceBonusRoyal;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const valuableTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance];

        let totalRoyalDices = 0;
        for (const type of valuableTypes) {
            if (!this.card.hasCell(type)) {
                continue;
            }

            const dice = this.card.getCellPlayable(type).dice;
            if (pointsAsRoyalDice(dice) !== 0) {
                totalRoyalDices++;
            }
        }

        return totalRoyalDices > 1 ? (totalRoyalDices - 1) * Config.CostRoyalBonusPerItem : 0;
    }
}
