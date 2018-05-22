import {CellType} from "../CellType";
import {IServiceCell} from "../IServiceCell";
import {ICard} from "../../Card";

export class TotalNumbersWithBonusCell implements IServiceCell {
    public type: CellType;
    private card: ICard;

    constructor() {
        this.type = CellType.ServiceTotalNumbersWithBonus;
    }

    public linkCard(card: ICard): void {
        this.card = card;
    }

    public get value(): number {
        const numbers: IServiceCell = this.card.getCellService(CellType.ServiceTotalNumbers);
        const bonus: IServiceCell = this.card.getCellService(CellType.ServiceBonus63);
        return numbers.value + bonus.value;
    }
}
