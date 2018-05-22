import {CellType} from "../CellType";
import {IServiceCell} from "../IServiceCell";
import {sumPoints} from "../CellsUtil";
import {ICard} from "../../Card";

export class BottomPointsCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceBottomPoints;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const types = [
            CellType.Kind3, CellType.Kind4, CellType.FullHouse, CellType.SmallStraight, CellType.LargeStraight,
            CellType.RoyalDice, CellType.Chance];
        return sumPoints(this.card, types);
    }
}
