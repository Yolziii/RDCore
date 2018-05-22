import {AppEvent, AppState, ClientApplication, IAppState} from "../Application";
import {IRound} from "../../model/coreGameplay/round/Rounds";
import {JokerThrower, Thrower} from "../../model/coreGameplay/round/Thrower";
import {Slot} from "../Protocol";
import {SingleRound} from "../../model/coreGameplay/round/SingleRound";
import {RoundPlayer} from "../../model/coreGameplay/round/RoundPlayer";
import {SingleRoundController} from "./SingleRoundController";
import {
    CardCellsFactory, ICardCellsFactory,
    MultiplierCardCellsFactory
} from "../../model/coreGameplay/round/CardCellFactories";
import {StartRoundEvent} from "./StartRoundState";
import {ICardFactory, StandardCardFactory} from "../../model/coreGameplay/round/CardFactories";
import {RoundMode} from "./RoundMode";

export interface IRoundState {
    finishRound();
    quitRound();
}

export class FinishRoundEvent extends AppEvent {
    public readonly model:IRound;

    constructor(model:IRound) {
        super(Slot.RoundResult);
        this.model = model;
    }
}

export class SingleRoundState extends AppState implements IAppState, IRoundState {
    private controller:SingleRoundController;
    private model:SingleRound;

    private cardFactory:ICardFactory;
    private cellsFactory:ICardCellsFactory;
    private cellsX2Factory:ICardCellsFactory;
    private cellsX3Factory:ICardCellsFactory;

    constructor() {
        super(Slot.Round);
    }

    public init() {
        const view = (this.app as ClientApplication).viewFactory.createRoundView();
        this.controller = new SingleRoundController(this, view);

        this.cardFactory = new StandardCardFactory();
        this.cellsFactory = new CardCellsFactory();
        this.cellsX2Factory = new MultiplierCardCellsFactory(2);
        this.cellsX3Factory = new MultiplierCardCellsFactory(3);
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
                this.cardFactory.createCard(this.cellsFactory),
                this.cardFactory.createCard(this.cellsX2Factory),
                this.cardFactory.createCard(this.cellsX3Factory)
            );
        } else if (event.mode === RoundMode.SingleRound) {
            player = new RoundPlayer(
                thrower,
                this.cardFactory.createCard(this.cellsFactory)
            );
        }

        this.model = new SingleRound(player);

        this.controller.activate(this.model);
    }

    public exit() {
        this.controller.exit();
    }

    public finishRound() {
        this.app.proceedExitToEvent(new FinishRoundEvent(this.model));
    }

    public quitRound() {
        this.app.toState(Slot.RoundQuit);
    }
}
