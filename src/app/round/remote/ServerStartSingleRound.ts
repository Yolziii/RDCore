import {IRemoteApplication, ServerSideAppState} from "../../Application";
import {Protocol} from "../../Protocol";
import {StartRoundEvent} from "../StartRoundState";
import {
    ServerRoundFillCellState,
    ServerRoundFreeDieState, ServerRoundHoldDieState, ServerRoundSelectCardState,
    ServerRoundThrowDiceState
} from "./StatesAndEvents";
import {IRound} from "../../../model/coreGameplay/round/Rounds";
import {LazyThrower, Thrower} from "../../../model/coreGameplay/round/Thrower";
import {SingleRound} from "../../../model/coreGameplay/round/SingleRound";
import {RoundPlayer} from "../../../model/coreGameplay/round/RoundPlayer";
import {ICardFactory, StandardCardFactory} from "../../../model/coreGameplay/round/CardFactories";
import {CardCellsFactory, ICardCellsFactory} from "../../../model/coreGameplay/round/CardCellFactories";

export class ServerStartSingleRound extends ServerSideAppState {
    private model:IRound;

    private cardFactory:ICardFactory;
    private cellsFactory:ICardCellsFactory;

    private throwState:ServerRoundThrowDiceState;
    private holdDieState:ServerRoundHoldDieState;
    private freeDieState:ServerRoundFreeDieState;
    private selectCardState:ServerRoundSelectCardState;
    private fillCellState:ServerRoundFillCellState;

    constructor(clientApp:IRemoteApplication) {
        super(Protocol.ConfirmStartServerRound, clientApp);
    }

    public init() {
        this.cardFactory = new StandardCardFactory();
        this.cellsFactory = new CardCellsFactory();

        this.throwState = new ServerRoundThrowDiceState(this.appClient);
        this.holdDieState = new ServerRoundHoldDieState(this.appClient);
        this.freeDieState = new ServerRoundFreeDieState(this.appClient);
        this.selectCardState = new ServerRoundSelectCardState(this.appClient);
        this.fillCellState = new ServerRoundFillCellState(this.appClient);

        this.app.fillSlot(this.throwState);
        this.app.fillSlot(this.holdDieState);
        this.app.fillSlot(this.freeDieState);
        this.app.fillSlot(this.selectCardState);
        this.app.fillSlot(this.fillCellState);
    }

    public activate(event:StartRoundEvent) {
        const thrower:Thrower = new Thrower();

        const card = this.cardFactory.createCard(this.cellsFactory);
        const player:RoundPlayer = new RoundPlayer(thrower, card);

        this.model = new SingleRound(player);

        this.throwState.linkModel(this.model);
        this.holdDieState.linkModel(this.model);
        this.freeDieState.linkModel(this.model);
        this.selectCardState.linkModel(this.model);
        this.fillCellState.linkModel(this.model);

        event.slot = Protocol.Round;
        this.appClient.proceedEvent(event);
    }

    public exit() {
        /*this.app.clearSlot(Protocol.RoundThrowDice);
        this.app.clearSlot(Protocol.RoundHoldDie);
        this.app.clearSlot(Protocol.RoundFreeDie);
        this.app.clearSlot(Protocol.RoundSelectCard);
        this.app.clearSlot(Protocol.RoundFillCell);*/
    }
}
