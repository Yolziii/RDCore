import {AppState} from "../Application";
import {RoundController} from "./RoundController";
import {RoundPlayerCard1, SingleRound} from "../../core/Rounds";
import {Card} from "../../core/Cards";
import {Thrower} from "../../core/round/Thrower";
import {
    Bonus63Cell, BonusRoyalCell, BottomPointsCell, CellType, ChanceCell, FinalScoreCell, FullHouseCell, KindCell,
    NumberCell,
    RoyalDiceCell,
    StraightCell,
    TopPointsCell, TotalBonusesCell
} from "../../core/Cells";
import {Config} from "../../core/Config";

export class SingleRoundState extends AppState {
    private controller:RoundController;

    public activate() {
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

                new BonusRoyalCell(),
                new BottomPointsCell(),
                new TotalBonusesCell(),
                new FinalScoreCell()

            ]),
            new Thrower());
        const model = new SingleRound(player);

        this.controller.activate(model);
    }

    protected init() {
        this.controller = new RoundController(this.app, this.app.viewFactory.createRoundView());
    }
}
