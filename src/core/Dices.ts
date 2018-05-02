import {Config, IDice, IDie} from "../gameplay";
import RDError, {RDErrorCode} from "./RDError";

export class Dice implements IDice{
    protected dice:IDie[] = [];
    protected _max:number;

    constructor(...dice:IDie[]) {
        this._max =  Config.DefaultDiceSize;
        for (let i=0; i<this._max; i++) {
            if (i < dice.length) {
                this.dice[i] = dice[i];
            } else {
                this.dice[i] = null;
            }
        }
    }

    max():number {
        return this._max;
    }

    total():number {
        let res = 0;
        for (let i=0; i<this._max; i++) {
            if (this.dice[i] != null) res++;
        }
        return res;
    }

    isFull():Boolean {
        for (let i=0; i<this._max; i++) {
            if (this.dice[i] == null) return false;
        }
        return true;
    }

    pop(index):IDie {
        let die:IDie = this.get(index);
        this.dice[index] = null;
        return die;
    }

    get(index):IDie {
        let die:IDie = this.dice[index];
        if (die == null) {
            throw new RDError(RDErrorCode.DICE_INDEX_EMPTY, `Can't get() die at [${index}]`)
        }
        return die;
    }

    put(die:IDie, index:number = -1):void {
        if (index != -1) {
            if (this.dice[index] != null) {
                throw new RDError(RDErrorCode.DICE_INDEX_FULL, `Dice already contains die at - ${index}`)
            }
            this.dice[index] = die;
        } else {
            let finded = false;
            for (let i=0; i<this._max; i++) {
                if (this.dice[i] != null) continue;

                this.dice[i] = die;
                finded = true;
                break;
            }

            if (!finded) {
                throw new RDError(RDErrorCode.DICE_IF_FULL, `Dice is full, can't add the new one - ${die}`)
            }
        }
    }
}

export abstract class DiceDecorator implements IDice {
    protected dice:IDice;

    constructor(dice:IDice) {
        this.dice = dice;
    }

    max():number {
        return this.dice.max();
    }

    total():number {
        return this.dice.total();
    }

    isFull():Boolean {
        return this.dice.isFull();
    }

    pop(index):IDie {
        return this.dice.pop(index);
    }

    get(index):IDie {
        return this.dice.get(index);
    }

    put(die:IDie, index:number):void {
        this.dice.put(die, index);
    }
}

export class FullDiceDecorator extends DiceDecorator {
    get(index):IDie {
        if (!this.isFull()) {
            throw new RDError(RDErrorCode.DICE_NOT_FULL, "Dice not full!");
        }
        return this.dice.get(index);
    }
}