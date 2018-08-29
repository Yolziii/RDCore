import {SingleRoundController} from "../../controllers/round/SingleRoundController";
import {RoundMode} from "../../controllers/round/RoundMode";
import {ClientApplication} from "../../ClientApplication";
import {IRoundState} from "../../controllers/round/IRoundState";
import {FinishRoundEvent} from "../../../events/round/FinishRoundEvent";
import {StartRoundEvent} from "../../../events/round/StartRoundEvent";
import {AppState} from "../../../AppState";
import {IAppState} from "../../../IAppState";
import {SingleRound} from "../../../../model/coreGameplay/round/SingleRound";
import {ICardFactory} from "../../../../model/coreGameplay/round/cardFactories/ICardFactory";
import {ICardCellsFactory} from "../../../../model/coreGameplay/round/cardCellFactories/ICardCellsFactory";
import {StateSlot} from "../../../StateSlot";
import {StandardCardFactory} from "../../../../model/coreGameplay/round/cardFactories/StandardCardFactory";
import {DefaultCardCellsFactory} from "../../../../model/coreGameplay/round/cardCellFactories/DefaultCardCellsFactory";
import {MultiplierCardCellsFactory} from "../../../../model/coreGameplay/round/cardCellFactories/MultiplierCardCellsFactory";
import {JokerThrower, Thrower} from "../../../../model/coreGameplay/round/Thrower";
import {RoundPlayer} from "../../../../model/coreGameplay/round/RoundPlayer";

export class SingleRoundState extends AppState implements IAppState, IRoundState {
    private controller:SingleRoundController;
    private model:SingleRound;

    private cardFactory:ICardFactory;
    private cellsFactory:ICardCellsFactory;
    private cellsX2Factory:ICardCellsFactory;
    private cellsX3Factory:ICardCellsFactory;

    constructor() {
        super(StateSlot.Round);
    }

    public init() {
        const view = (this.app as ClientApplication).viewFactory.createRoundView();
        this.controller = new SingleRoundController(this, view);

        this.cardFactory = new StandardCardFactory();
        this.cellsFactory = new DefaultCardCellsFactory();
        this.cellsX2Factory = new MultiplierCardCellsFactory(2);
        this.cellsX3Factory = new MultiplierCardCellsFactory(3);
    }

    public activate(event:StartRoundEvent):void {
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

    public sleep() {
        this.controller.exit();
    }

    public finishRound() {
        this.app.proceedExitToEvent(new FinishRoundEvent(this.model));
    }

    public quitRound() {
        this.app.toState(StateSlot.RoundQuit);
    }
}
