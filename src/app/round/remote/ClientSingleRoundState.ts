import {ClientApplication, ClientSideAppState, IRemoteApplication} from "../../Application";
import {Protocol} from "../../Protocol";
import {IRound, IRoundObserver, IRoundPlayer} from "../../../model/coreGameplay/round/Rounds";
import {CellType} from "../../../model/coreGameplay/Cells";
import {IDice} from "../../../model/coreGameplay/Dices";
import {ICard} from "../../../model/coreGameplay/Cards";
import {
    ClientRoundFillCellState, ClientRoundFreeDieState, ClientRoundHoldDieState, ClientRoundSelectCardState,
    ClientSetThrowedDiceState,
    RoundFillCellAppEvent,
    RoundIndexAppEvent
} from "./StatesAndEvents";
import {FinishRoundEvent, IRoundState} from "../SingleRoundState";
import {SingleRoundController} from "../SingleRoundController";
import {LazyThrower, Thrower} from "../../../model/coreGameplay/round/Thrower";
import {RoundPlayer} from "../../../model/coreGameplay/round/RoundPlayer";
import {CardCellsFactory, ICardCellsFactory} from "../../../model/coreGameplay/round/CardCellFactories";
import {SingleRound} from "../../../model/coreGameplay/round/SingleRound";
import {ICardFactory, StandardCardFactory} from "../../../model/coreGameplay/round/CardFactories";

/**
 * Заместитель локальной модели раунда, запрашивает разрешение на все меняющие модель операции у сервера
 */
export class ClientSingleRoundState extends ClientSideAppState implements IRound, IRoundState {
    private localModel:IRound;
    private controller:SingleRoundController;

    private cardFactory:ICardFactory;
    private cellsFactory:ICardCellsFactory;

    private clientSetThrowedDiceState:ClientSetThrowedDiceState;
    private clientHoldDieState:ClientRoundHoldDieState;
    private clientFreeDieState:ClientRoundFreeDieState;
    private clientSelectCardState:ClientRoundSelectCardState;
    private clientFillCellState:ClientRoundFillCellState;

    constructor(appServer:IRemoteApplication) {
        super(Protocol.Round, appServer);
    }

    public init() {
        const view = (this.app as ClientApplication).viewFactory.createRoundView();
        this.controller = new SingleRoundController(this, view);

        this.cardFactory = new StandardCardFactory();
        this.cellsFactory = new CardCellsFactory();

        this.clientSetThrowedDiceState = new ClientSetThrowedDiceState();
        this.clientHoldDieState = new ClientRoundHoldDieState(this.appServer);
        this.clientFreeDieState = new ClientRoundFreeDieState(this.appServer);
        this.clientSelectCardState = new ClientRoundSelectCardState(this.appServer);
        this.clientFillCellState = new ClientRoundFillCellState(this.appServer);
    }

    public activate() {
        const thrower:Thrower = new LazyThrower();

        const card = this.cardFactory.createCard(this.cellsFactory);
        const player:RoundPlayer = new RoundPlayer(thrower, card);

        this.localModel = new SingleRound(player);

        this.clientSetThrowedDiceState.linkModel(this.localModel);
        this.clientHoldDieState.linkModel(this.localModel);
        this.clientFreeDieState.linkModel(this.localModel);
        this.clientSelectCardState.linkModel(this.localModel);
        this.clientFillCellState.linkModel(this.localModel);

        this.app.fillSlot(this.clientSetThrowedDiceState);
        this.app.fillSlot(this.clientHoldDieState);
        this.app.fillSlot(this.clientFreeDieState);
        this.app.fillSlot(this.clientSelectCardState);
        this.app.fillSlot(this.clientFillCellState);

        this.controller.activate(this);
    }

    public exit() {
        this.appServer.toState(Protocol.WaitForClient);
        this.controller.exit();
    }

    // ------------------------------------------------------------------
    // IRoundState implementation
    // ------------------------------------------------------------------
    public finishRound() {
        this.app.proceedExitToEvent(new FinishRoundEvent(this.localModel));
    }

    public quitRound() {
        this.app.toState(Protocol.RoundQuit);
    }

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
        this.appServer.toState(Protocol.RoundThrowDice);
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

    public selectPlayer(index:number) {/* В сингловой игре ничего не делаем */} // TODO: Может состояние тоже сделать одно на всех режимов, не только для контролируемого синглплеера?

    // ------------------------------------------------------------------
    // Делегируем остальные методы локальной модели
    // ------------------------------------------------------------------
    public get totalPlayers():number {return this.localModel.totalPlayers;}
    public get score():number {return this.localModel.score;}
    public get throwsLeft(): number {return this.localModel.throwsLeft;}
    public get throwed():IDice {return this.localModel.throwed;}
    public get holded():IDice {return this.localModel.holded;}
    public get totalCards():number {return this.localModel.totalCards;}
    public get activeCardIndex():number {return this.localModel.activeCardIndex;}
    public get finished():boolean {return this.localModel.finished;}

    public getMixedDice():IDice {return this.localModel.getMixedDice();}
    public getPlayer():IRoundPlayer {return this.localModel.getPlayer();}
    public canHoldDie(index:number) {return this.localModel.canHoldDie(index);}
    public canFreeDie(index:number) {return this.localModel.canFreeDie(index);}
    public getCard():ICard {return this.localModel.getCard();}

    public addObserver(observer:IRoundObserver) {this.localModel.addObserver(observer);}
    public removeObserver(observer:IRoundObserver) {this.localModel.removeObserver(observer);}
}
