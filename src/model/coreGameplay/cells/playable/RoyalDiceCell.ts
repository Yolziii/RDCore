import {CellType} from "../CellType";
import {IPlayableCell} from "../IPlayableCell";
import {APlayableCell} from "../APlayableCell";
import {pointsAsRoyalDice} from "../CellsUtil";
import {IDice} from "../../dice/IDice";

export class RoyalDiceCell extends APlayableCell implements IPlayableCell {
    constructor() {
        super();
        this.type = CellType.RoyalDice;
    }

    public get value(): number {
        return pointsAsRoyalDice(this.cellDice);
    }

    public valueFor(dice: IDice):number {
        return pointsAsRoyalDice(dice);
    }
}
