import {IServiceCell} from "../IServiceCell";
import {CellType} from "../CellType";
import {Config} from "../../../Config";
import {sumPoints} from "../CellsUtil";
import {ICard} from "../../Card";

export class Bonus63Cell implements IServiceCell {
    public type: CellType;
    private card: ICard;
    private threshold:number;

    constructor(threshold:number = Config.ThresholdBonus63) {
        this.threshold = threshold;
        this.type = CellType.ServiceBonus63;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numberTypes = [
            CellType.Ones, CellType.Twos, CellType.Threes, CellType.Fours, CellType.Fives, CellType.Sixes];
        const sum = sumPoints(this.card, numberTypes);
        return (sum >= this.threshold) ? Config.CostBonus63 : 0;
    }
}
