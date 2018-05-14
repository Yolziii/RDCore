import {
    IRound, IRoundPlayer, IRoundPlayerFillObserver, IRoundPlayerFreeObserver, IRoundPlayerHoldObserver,
    IRoundPlayerThrowObserver
} from "./Rounds";
import {ICard} from "../Cards";
import {IDice} from "../Dices";
import {CellType} from "../Cells";
import {RoundPlayerCard1} from "./RoundPlayerCard1";

export class SingleRound implements IRound {
    public readonly totalPlayers:number = 1;
    public readonly totalCards:number = 1;

    private player:RoundPlayerCard1;

    constructor(player:RoundPlayerCard1) {
        this.player = player;
    }

    public getPlayer():IRoundPlayer {
        return this.player;
    }

    public getCard():ICard {
        return this.player.getCard();
    }

    public setActivePlayer(index:number) {/**/}

    public get finished() {
        const card:ICard = this.player.getCard();
        return card.finished;
    }

    public get throwsLeft(): number {return this.player.throwsLeft;}
    public get dice():IDice {return this.player.dice;}

    public get throwed():IDice {return this.player.throwed;}
    public get holded():IDice {return this.player.holded;}

    public canHoldDie(index:number):boolean {return this.player.canHoldDie(index);}
    public canFreeDie(index:number):boolean {return this.player.canFreeDie(index);}

    public holdDie(index:number) {return this.player.holdDie(index);}
    public freeDie(index:number) {return this.player.freeDie(index);}

    public throwDice() {this.player.throwDice();}
    public fillCell(type:CellType) {
        this.player.fillCell(type);
    }

    public registerObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        this.player.registerObserver(observer);
    }

    public unregisterObserver(observer:IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver) {
        this.player.unregisterObserver(observer);
    }

    public setActiveCard() {/**/}
}
