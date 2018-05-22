import {CellType} from "../CellType";
import {IServiceCell} from "../IServiceCell";
import {sumPoints} from "../CellsUtil";
import {ICard} from "../../Card";

export class TotalNumbersCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTotalNumbers;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        return sumPoints(this.card, numberTypes);
    }
}
