import {CellType} from "../CellType";
import {IServiceCell} from "../IServiceCell";
import {sumPoints} from "../CellsUtil";
import {ICard} from "../../Card";

export class FinalScoreCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceFinalScore;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        return sumPoints(this.card, [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes,
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance,
            CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}
