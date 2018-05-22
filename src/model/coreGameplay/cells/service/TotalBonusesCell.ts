import {CellType} from "../CellType";
import {IServiceCell} from "../IServiceCell";
import {sumPoints} from "../CellsUtil";
import {ICard} from "../../Card";

export class TotalBonusesCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTotalBonuses;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        return sumPoints(this.card, [CellType.ServiceBonus63, CellType.ServiceBonusRoyal]);
    }
}
