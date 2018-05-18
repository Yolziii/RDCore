import {AppEvent, AppState, ClientApplication, IAppEvent, IAppState} from "../Application";
import {IRound} from "../../model/coreGameplay/round/Rounds";
import {Card} from "../../model/coreGameplay/Cards";
import {JokerThrower, Thrower} from "../../model/coreGameplay/round/Thrower";
import {CellType} from "../../model/coreGameplay/Cells";
import {Protocol} from "../Protocol";
import {SingleRound} from "../../model/coreGameplay/round/SingleRound";
import {RoundPlayer} from "../../model/coreGameplay/round/RoundPlayer";
import {SingleRoundController} from "./SingleRoundController";
import {CardCellsFactory, MultiplierCardCellsFactory} from "../../model/coreGameplay/round/CardCellFactories";
import {StartRoundEvent} from "./StartRoundState";
import {RoundMode} from "../mainScreen/MainScreenState";

export interface IRoundState {
    finishRound();
    quitRound();
}

export class FinishRoundEvent extends AppEvent {
    public readonly model:IRound;

    constructor(model:IRound) {
        super(Protocol.RoundResult);
        this.model = model;
    }
}

export class SingleRoundState extends AppState implements IAppState, IRoundState {
    private controller:SingleRoundController;
    private model:SingleRound;

    constructor() {
        super(Protocol.Round);
    }

    public init() {
        const view = (this.app as ClientApplication).viewFactory.createRoundView();
        this.controller = new SingleRoundController(this, view);
    }

    public activate(event:StartRoundEvent) {
        let thrower:Thrower = new Thrower();
        if (event != null) {
            const withJokers = (event as StartRoundEvent).withJokers;
            if (withJokers) {
                thrower = new JokerThrower();
            }
        }

        let player:RoundPlayer;

        if (event.mode === RoundMode.SingleRoundTriple) {
            player = new RoundPlayer(
                thrower,
                this.createCard(new CardCellsFactory()),
                this.createCard(new MultiplierCardCellsFactory(2)),
                this.createCard(new MultiplierCardCellsFactory(3))
            );
        } else if (event.mode === RoundMode.SingleRound) {
            const card = this.createCard(new CardCellsFactory());
            player = new RoundPlayer(thrower, card);
        }

        this.model = new SingleRound(player);

        this.controller.activate(this.model);
    }

    public sleep() {
        this.controller.sleep();
    }

    public finishRound() {
        this.app.proceedExitToEvent(new FinishRoundEvent(this.model));
    }

    public quitRound() {
        this.app.toState(Protocol.RoundQuit);
    }

    private createCard(factory:CardCellsFactory) {
        return new Card(
            factory,

            CellType.Ones,
            /*CellType.Twos,
            CellType.Threes,
            CellType.Fours,
            CellType.Fives,
            CellType.Sixes,
            CellType.ServiceBonus63,
            CellType.ServiceTopPoints,
            CellType.Kind3,
            CellType.Kind4,
            CellType.FullHouse,
            CellType.SmallStraight,
            CellType.LargeStraight,
            CellType.RoyalDice,
            CellType.Chance,
            CellType.ServiceBottomPoints,*/
            CellType.ServiceFinalScore
        );
    }
}
