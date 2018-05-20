import {Config} from "../Config";
import RDError from "../RDError";
import {RDErrorCode} from "../RDErrorCode";
import {AppEvent, IDeserializer, ISerializable} from "../../app/Application";

export interface IDie {
    readonly type: DieType;
    readonly value?: number;
}

export const enum DieType {
    Value = "Value",
    Joker = "Joker",
    Unknown = "Unknown",
    Blocked = "Blocked",
    Empty = "Empty"
}

export const JokerDie = {value:0, type:DieType.Joker};

export const NullDie:IDie = {type: DieType.Unknown, value: 0 };

export interface IDice extends ISerializable {
    readonly length: number;
    readonly total: number;
    readonly isFull: boolean;

    put(die: IDie): void;
    putTo(die: IDie, index: number): void;
    popFrom(index:number): IDie;
    getFrom(index:number): IDie;
    hasAt(index:number):boolean;

    clear();
}

export class Dice implements IDice {
    public static fromJSON(json: any): AppEvent {
        const event = Object.create(Dice.prototype);
        return Object.assign(event, json);
    }

    private dice: IDie[] = [];
    private _length: number;

    constructor(...dice: IDie[]) {
        this._length = Config.DefaultDiceSize;
        for (let i = 0; i < this._length; i++) {
            if (i < dice.length) {
                this.dice[i] = dice[i];
            } else {
                this.dice[i] = NullDie;
            }
        }
    }

    public toJSON(): any {
        return Object.assign({}, this);
    }

    public get length(): number {
        return this._length;
    }

    // TODO: changeLength(newLength:number)

    public get total(): number {
        let res = 0;
        for (let i = 0; i < this._length; i++) {
            if (this.dice[i] !== NullDie) {
                res++;
            }
        }
        return res;
    }

    public get isFull(): boolean {
        for (let i = 0; i < this._length; i++) {
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
        return (die.type !== DieType.Unknown);
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
            for (let i = 0; i < this._length; i++) {
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

    public clear() {
        for (let i = 0; i < this._length; i++) {
            this.dice[i] = NullDie;
        }
    }
}

export const NullDice: IDice = new Dice();
