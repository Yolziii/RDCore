import {CellType} from "../CellType";
import {IServiceCell} from "../IServiceCell";
import {sumPoints} from "../CellsUtil";
import {ICard} from "../../Card";

export class TopPointsCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTopPoints;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        let sum = sumPoints(this.card, numberTypes);
        if (this.card.hasCell(CellType.ServiceBonus63)) {
            sum += this.card.getCellService(CellType.ServiceBonus63).value;
        }
        return sum;
    }
}
