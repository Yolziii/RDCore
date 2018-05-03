import {Config} from "./Config";
import {IDice, IDie} from "./gameplay";
import {RDError, RDErrorCode} from "./RDError";

export class Dice implements IDice {
    protected dice: IDie[] = [];
    protected maxDies: number;

    constructor(...dice: IDie[]) {
        this.maxDies = Config.DefaultDiceSize;
        for (let i = 0; i < this.maxDies; i++) {
            if (i < dice.length) {
                this.dice[i] = dice[i];
            } else {
                this.dice[i] = null;
            }
        }
    }

    public max(): number {
        return this.maxDies;
    }

    public total(): number {
        let res = 0;
        for (let i = 0; i < this.maxDies; i++) {
            if (this.dice[i] != null) {
                res++;
            }
        }
        return res;
    }

    public isFull(): boolean {
        for (let i = 0; i < this.maxDies; i++) {
            if (this.dice[i] == null) {
                return false;
            }
        }
        return true;
    }

    public pop(index): IDie {
        const die: IDie = this.get(index);
        this.dice[index] = null;
        return die;
    }

    public get(index): IDie {
        const die: IDie = this.dice[index];
        if (die == null) {
            throw new RDError(RDErrorCode.DICE_INDEX_EMPTY, `Can't get() die at [${index}]`);
        }
        return die;
    }

    public put(die: IDie, index: number = -1): void {
        if (index !== -1) {
            if (this.dice[index] != null) {
                throw new RDError(RDErrorCode.DICE_INDEX_FULL, `Dice already contains die at - ${index}`);
            }
            this.dice[index] = die;
        } else {
            let finded = false;
            for (let i = 0; i < this.maxDies; i++) {
                if (this.dice[i] != null) {
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

export abstract class DiceDecorator implements IDice {
    protected dice: IDice;

    constructor(dice: IDice) {
        this.dice = dice;
    }

    public max(): number {
        return this.dice.max();
    }

    public total(): number {
        return this.dice.total();
    }

    public isFull(): boolean {
        return this.dice.isFull();
    }

    public pop(index): IDie {
        return this.dice.pop(index);
    }

    public get(index): IDie {
        return this.dice.get(index);
    }

    public put(die: IDie, index: number): void {
        this.dice.put(die, index);
    }
}

export class FullDiceDecorator extends DiceDecorator {
    public get(index): IDie {
        if (!this.isFull()) {
            throw new RDError(RDErrorCode.DICE_NOT_FULL, "Dice not full!");
        }
        return this.dice.get(index);
    }
}
