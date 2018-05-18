import {ClientSideAppState, IRemoteApplication} from "../../Application";
import {Protocol} from "../../Protocol";
import {IRound, IRoundObserver, IRoundPlayer} from "../../../model/coreGameplay/round/Rounds";
import {CellType} from "../../../model/coreGameplay/Cells";
import {IDice} from "../../../model/coreGameplay/Dices";
import {ICard} from "../../../model/coreGameplay/Cards";
import {RoundFillCellAppEvent, RoundIndexAppEvent} from "./StatesAnsEvents";

/**
 * Заместитель локальной модели раунда, запрашивает разрешение на все меняющие модель операции у сервера
 */
export class ClientSingleRoundState extends ClientSideAppState implements IRound {
    private localModel:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {0
        super(Protocol.Round, appServer);
        this.localModel = model;
    }

    // TODO: События, за которые отвевает сам стейт - вынести в интерфейс, с укоторым взаимодействует контроллер

    // ------------------------------------------------------------------
    // Меняющие модели методы делегируем серверу
    // ------------------------------------------------------------------
    public holdDie(index:number) {
        const event  = new RoundIndexAppEvent(Protocol.RoundHoldDie, index);
        this.appServer.proceedEvent(event);
    }

    public freeDie(index:number) {
        const event  = new RoundIndexAppEvent(Protocol.RoundFreeDie, index);
        this.appServer.proceedEvent(event);
    }

    public throwDice() {
        this.appServer.toState(Protocol.RoundThrowDice, null);
    }

    public setThrowedDice(dice:IDice) { /* Ничего не делаем, все сделает ClientSetThrowedDiceState */}

    public selectCard(index:number) {
        const event  = new RoundIndexAppEvent(Protocol.RoundSelectCard, index);
        this.appServer.proceedEvent(event);
    }

    public fillCell(type:CellType) {
        const event  = new RoundFillCellAppEvent(type);
        this.appServer.proceedEvent(event);
    }

    public selectPlayer(index:number) {/* В сингловой игре ничего не делаем */} // TODO: Может состояние тоже сделать одно на всех режимов, не только для контролируемого синглплеера

    // ------------------------------------------------------------------
    // Делегируем остальные методы локальной модели
    // ------------------------------------------------------------------
    public get totalPlayers():number {return this.localModel.totalPlayers;}
    public get score():number {return this.localModel.score;}
    public get throwsLeft(): number {return this.localModel.throwsLeft;}
    public get dice():IDice {return this.localModel.dice;}
    public get throwed():IDice {return this.localModel.throwed;}
    public get holded():IDice {return this.localModel.holded;}
    public get totalCards():number {return this.localModel.totalCards;}
    public get activeCardIndex():number {return this.localModel.activeCardIndex;}
    public get finished():boolean {return this.localModel.finished;}

    public getPlayer():IRoundPlayer {return this.localModel.getPlayer();}
    public canHoldDie(index:number) {return this.localModel.canHoldDie(index);}
    public canFreeDie(index:number) {return this.localModel.canFreeDie(index);}
    public getCard():ICard {return this.localModel.getCard();}

    public addObserver(observer:IRoundObserver) {this.localModel.addObserver(observer);}
    public removeObserver(observer:IRoundObserver) {this.localModel.removeObserver(observer);}
}
