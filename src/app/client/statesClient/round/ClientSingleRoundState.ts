import {SingleRoundController} from "../../controllers/round/SingleRoundController";
import {ClientApplication} from "../../ClientApplication";
import {ClientSetThrowedDiceState} from "./ClientSetThrowedDiceState";
import {ClientRoundHoldDieState} from "./ClientRoundHoldDieState";
import {ClientRoundFreeDieState} from "./ClientRoundFreeDieState";
import {ClientRoundSelectCardState} from "./ClientRoundSelectCardState";
import {ClientRoundFillCellState} from "./ClientRoundFillCellState";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {RoundFillCellAppEvent} from "../../../events/round/RoundFillCellAppEvent";
import {IRoundState} from "../../controllers/round/IRoundState";
import {FinishRoundEvent} from "../../../events/round/FinishRoundEvent";
import {ClientSideAppState} from "../../../ClientSideAppState";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {ICardFactory} from "../../../../model/coreGameplay/round/cardFactories/ICardFactory";
import {ICardCellsFactory} from "../../../../model/coreGameplay/round/cardCellFactories/ICardCellsFactory";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {Slot} from "../../../Slot";
import {StandardCardFactory} from "../../../../model/coreGameplay/round/cardFactories/StandardCardFactory";
import {DefaultCardCellsFactory} from "../../../../model/coreGameplay/round/cardCellFactories/DefaultCardCellsFactory";
import {LazyThrower, Thrower} from "../../../../model/coreGameplay/round/Thrower";
import {RoundPlayer} from "../../../../model/coreGameplay/round/RoundPlayer";
import {SingleRound} from "../../../../model/coreGameplay/round/SingleRound";
import {IDice} from "../../../../model/coreGameplay/dice/IDice";
import {CellType} from "../../../../model/coreGameplay/cells/CellType";
import {IRoundPlayer} from "../../../../model/coreGameplay/round/IRoundPlayer";
import {ICard} from "../../../../model/coreGameplay/Card";
import {IRoundObserver} from "../../../../model/coreGameplay/round/IRoundObserver";

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
        super(Slot.Round, appServer);
    }

    public init() {
        const view = (this.app as ClientApplication).viewFactory.createRoundView();
        this.controller = new SingleRoundController(this, view);

        this.cardFactory = new StandardCardFactory();
        this.cellsFactory = new DefaultCardCellsFactory();

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
        this.appServer.toState(Slot.WaitForClient);
        this.controller.exit();
    }

    // ------------------------------------------------------------------
    // IRoundState implementation
    // ------------------------------------------------------------------
    public finishRound() {
        this.app.proceedExitToEvent(new FinishRoundEvent(this.localModel));
    }

    public quitRound() {
        this.app.toState(Slot.RoundQuit);
    }

    // ------------------------------------------------------------------
    // Меняющие модели методы делегируем серверу
    // ------------------------------------------------------------------
    public holdDie(index:number) {
        const event  = new RoundIndexAppEvent(Slot.RoundHoldDie, index);
        this.appServer.proceedEvent(event);
    }

    public freeDie(index:number) {
        const event  = new RoundIndexAppEvent(Slot.RoundFreeDie, index);
        this.appServer.proceedEvent(event);
    }

    public throwDice() {
        this.appServer.toState(Slot.RoundThrowDice);
    }

    public setThrowedDice(dice:IDice) { /* Ничего не делаем, все сделает ClientSetThrowedDiceState */}

    public selectCard(index:number) {
        const event  = new RoundIndexAppEvent(Slot.RoundSelectCard, index);
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
