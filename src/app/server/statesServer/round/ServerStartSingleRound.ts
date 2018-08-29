import {Thrower} from "../../../../model/coreGameplay/round/Thrower";
import {SingleRound} from "../../../../model/coreGameplay/round/SingleRound";
import {RoundPlayer} from "../../../../model/coreGameplay/round/RoundPlayer";
import {ServerSideAppState} from "../../../ServerSideAppState";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {StateSlot} from "../../../StateSlot";
import {ServerRoundThrowDiceState} from "./ServerRoundThrowDiceState";
import {ServerRoundHoldDieState} from "./ServerRoundHoldDieState";
import {ServerRoundFreeDieState} from "./ServerRoundFreeDieState";
import {ServerRoundSelectCardState} from "./ServerRoundSelectCardState";
import {ServerRoundFillCellState} from "./ServerRoundFillCellState";
import {StartRoundEvent} from "../../../events/round/StartRoundEvent";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {ICardFactory} from "../../../../model/coreGameplay/round/cardFactories/ICardFactory";
import {ICardCellsFactory} from "../../../../model/coreGameplay/round/cardCellFactories/ICardCellsFactory";
import {StandardCardFactory} from "../../../../model/coreGameplay/round/cardFactories/StandardCardFactory";
import {DefaultCardCellsFactory} from "../../../../model/coreGameplay/round/cardCellFactories/DefaultCardCellsFactory";

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
        super(StateSlot.ConfirmStartServerRound, clientApp);
    }

    public init() {
        this.cardFactory = new StandardCardFactory();
        this.cellsFactory = new DefaultCardCellsFactory();

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

        event.slot = StateSlot.Round;
        this.appClient.proceedEvent(event);
    }

    public exit() {
        /*this.app.clearSlot(StateSlot.RoundThrowDice);
        this.app.clearSlot(StateSlot.RoundHoldDie);
        this.app.clearSlot(StateSlot.RoundFreeDie);
        this.app.clearSlot(StateSlot.RoundSelectCard);
        this.app.clearSlot(StateSlot.RoundFillCell);*/
    }
}
