import {AppEvent, AppState, ClientApplication, IAppEvent} from "../../application/Application";
import {IRound} from "../../core/round/Rounds";
import {Card} from "../../core/Cards";
import {JokerThrower, Thrower} from "../../core/round/Thrower";
import {
    Bonus63Cell, BonusRoyalCell, BottomPointsCell, CellType, ChanceCell, FinalScoreCell, FullHouseCell, KindCell,
    NumberCell,
    RoyalDiceCell,
    StraightCell,
    TopPointsCell, TotalBonusesCell
} from "../../core/Cells";
import {Config} from "../../core/Config";
import {Protocol} from "../Protocol";
import {SingleRound} from "../../core/round/SingleRound";
import {RoundPlayerCard1} from "../../core/round/RoundPlayerCard1";
import {SingleRoundController} from "./SingleRoundController";
import {SingleRoundEvent} from "../mainScreen/MainScreenState";

export interface IRoundState {
    finishRound();
}

export class FinishRoundEvent extends AppEvent {
    public readonly model:IRound;

    constructor(model:IRound) {
        super(Protocol.RoundResult);
        this.model = model;
    }
}

export class SingleRoundState extends AppState implements IRoundState {
    private controller:SingleRoundController;
    private model:SingleRound;

    public finishRound() {
        this.app.onExitEvent(new FinishRoundEvent(this.model));
    }

    public activate(event:IAppEvent=null) {
        let thrower:Thrower = new Thrower();
        if (event != null) {
            const withJokers = (event as SingleRoundEvent).withJokers;
            if (withJokers) {
                thrower = new JokerThrower();
            }
        }

        const player = new RoundPlayerCard1();
        player.init(new Card(
            [
                new NumberCell(CellType.Ones, 1),
                new NumberCell(CellType.Twos, 2),
                new NumberCell(CellType.Threes, 3),
                new NumberCell(CellType.Fours, 4),
                new NumberCell(CellType.Fives, 5),
                new NumberCell(CellType.Sixes, 6),

                new Bonus63Cell(),
                new TopPointsCell(),

                new KindCell(CellType.Kind3, 3),
                new KindCell(CellType.Kind4, 4),
                new FullHouseCell(),
                new StraightCell(CellType.SmallStraight, Config.CostSmallStraight, 4),
                new StraightCell(CellType.LargeStraight, Config.CostLargeStraight, 5),
                new RoyalDiceCell(),
                new ChanceCell(),

               // new BonusRoyalCell(),
                new BottomPointsCell(),
               // new TotalBonusesCell(),
                new FinalScoreCell()
            ]),
            thrower);
        this.model = new SingleRound(player);

        this.controller.activate(this.model);
    }

    public sleep() {
        this.controller.sleep();
    }

    public init() {
        this.controller = new SingleRoundController(this, (this.app as ClientApplication).viewFactory.createRoundView());
    }
}
