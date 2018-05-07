import {Config} from "./Config";
import RDError from "./RDError";
import {RDErrorCode} from "./RDErrorCode";

export interface IDie {
    readonly type: DieType;
    readonly value: number;
}

export const enum DieType {
    Value = "Value",
    Jocker = "Jocker",
    Unknown = "Unknown",
    Blocked = "Blocked",
}

export const NullDie:IDie = {type: DieType.Unknown, value: 0 };

export interface IDice {
    readonly max: number;
    readonly total: number;
    readonly isFull: boolean;

    put(die: IDie): void;
    putTo(die: IDie, index: number): void;
    popFrom(index:number): IDie;
    getFrom(index:number): IDie;
    hasAt(index:number):boolean;
}

export class Dice implements IDice {
    protected dice: IDie[] = [];
    protected maxDies: number;

    constructor(...dice: IDie[]) {
        this.maxDies = Config.DefaultDiceSize;
        for (let i = 0; i < this.maxDies; i++) {
            if (i < dice.length) {
                this.dice[i] = dice[i];
            } else {
                this.dice[i] = NullDie;
            }
        }
    }

    public get max(): number {
        return this.maxDies;
    }

    public get total(): number {
        let res = 0;
        for (let i = 0; i < this.maxDies; i++) {
            if (this.dice[i] !== NullDie) {
                res++;
            }
        }
        return res;
    }

    public get isFull(): boolean {
        for (let i = 0; i < this.maxDies; i++) {
            if (this.dice[i] === NullDie) {
                return false;
            }
        }
        return true;
    }

    public popFrom(index): IDie {
        const die: IDie = this.getFrom(index);
        this.dice[index] = NullDie;
        return die;
    }

    public hasAt(index): boolean {
        const die: IDie = this.dice[index];
        return !(die === NullDie);
    }

    public getFrom(index): IDie {
        const die: IDie = this.dice[index];
        if (die === NullDie) {
            throw new RDError(RDErrorCode.DICE_INDEX_EMPTY, `Can't get() die at [${index}]`);
        }
        return die;
    }

    public put(die: IDie): void {
        this.putTo(die);
    }

    public putTo(die: IDie, index: number = -1): void {
        if (index !== -1) {
            if (this.dice[index] !== NullDie) {
                throw new RDError(RDErrorCode.DICE_INDEX_FULL, `Dice already contains die at - ${index}`);
            }
            this.dice[index] = die;
        } else {
            let finded = false;
            for (let i = 0; i < this.maxDies; i++) {
                if (this.dice[i] !== NullDie) {
                    continue;
                }

                this.dice[i] = die;
                finded = true;
                break;
            }

            if (!finded) {
                throw new RDError(RDErrorCode.DICE_IF_FULL, `Dice is full, can't add the new one - ${die}`);
            }
        }
    }
}

export const NullDice: IDice = new Dice();

export abstract class ADiceDecorator implements IDice {
    protected dice: IDice;

    constructor(dice: IDice) {
        this.dice = dice;
    }

    public get max(): number {
        return this.dice.max;
    }

    public get total(): number {
        return this.dice.total;
    }

    public get isFull(): boolean {
        return this.dice.isFull;
    }

    public popFrom(index:number): IDie {
        return this.dice.popFrom(index);
    }

    public getFrom(index:number): IDie {
        return this.dice.getFrom(index);
    }

    public putTo(die: IDie, index: number): void {
        this.dice.putTo(die, index);
    }

    public put(die: IDie): void {
        this.dice.put(die);
    }

    public hasAt(index:number):boolean {
        return this.dice.hasAt(index);
    }
}

export class FullDiceDecorator extends ADiceDecorator {
    public getFrom(index): IDie {
        if (!this.isFull) {
            throw new RDError(RDErrorCode.DICE_NOT_FULL, "Dice not full!");
        }
        return this.dice.getFrom(index);
    }
}
