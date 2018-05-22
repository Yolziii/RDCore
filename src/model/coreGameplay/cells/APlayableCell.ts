import {CellType} from "./CellType";
import {IPlayableCell} from "./IPlayableCell";
import {IDice} from "../dice/IDice";
import {Dice} from "../dice/Dice";
import {NullDice} from "../dice/NullDice";

/** Базовый класс для всех играбельный ячеек */
export abstract class APlayableCell implements IPlayableCell {
    public type: CellType;

    protected cellDice: IDice = NullDice;

    public get isFull() {
        return this.cellDice !== NullDice;
    }

    public get value(): number {
        return 0;
    }

    public get dice(): IDice {
        return this.cellDice;
    }

    public fill(dice: IDice): void {
        this.cellDice = new Dice();
        for (let i = 0; i<dice.length; i++) {
            this.cellDice.put(dice.getFrom(i));
        }
    }

    public abstract valueFor(dice: IDice):number;
}
