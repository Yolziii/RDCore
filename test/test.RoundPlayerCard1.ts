import * as assert from "assert";
import "mocha";
import {IRoundPlayerThrowObserver} from "../src/core/round/Rounds";
import {Card, ICard} from "../src/core/Cards";
import {CellType, FinalScoreCell, NumberCell, RoyalDiceCell} from "../src/core/Cells";
import {Config} from "../src/core/Config";
import {Thrower} from "../src/core/round/Thrower";
import {Dice, DieType, IDice, IDie} from "../src/core/Dices";
import {RoundPlayer} from "../src/core/round/RoundPlayer";
import {CardCellsFactory} from "../src/core/round/CardCellFactories";

describe("RoundPlayer", () => {
    let DIE1:IDie;
    class TestThrower extends Thrower {
        protected diceFactory() {
            return new Dice(DIE1, DIE1, DIE1, DIE1, DIE1);
        }

        protected fillDie(dice:IDice, index:number) {
            // tslint:disable-next-line
        }
    }

    const testThrower = new TestThrower();
    let roundPlayer:RoundPlayer;

    beforeEach(() => {
        const card:ICard = new Card(
            new CardCellsFactory(),
            CellType.Ones,
            CellType.RoyalDice,
            CellType.ServiceFinalScore
        );

        roundPlayer = new RoundPlayer(testThrower, card);

        DIE1 = {type:DieType.Value, value: 1};
    });

    it("Throws 3", () => {
        assert.equal(roundPlayer.throwsLeft, 3);
    });

    it("Throws 2", () => {
        roundPlayer.throwDice();
        assert.equal(roundPlayer.throwsLeft, 2);
    });

    it("Throws 1", () => {
        roundPlayer.throwDice();
        roundPlayer.throwDice();
        assert.equal(roundPlayer.throwsLeft, 1);
    });

    it("Throws 0", () => {
        roundPlayer.throwDice();
        roundPlayer.throwDice();
        roundPlayer.throwDice();
        assert.equal(roundPlayer.throwsLeft, 0);
    });

    it("No holded, no throwed", () => {
        assert.equal(roundPlayer.throwed.total,0);
        assert.equal(roundPlayer.holded.total,0);
    });

    it("Throwed if full", () => {
        roundPlayer.throwDice();
        assert.equal(roundPlayer.throwed.total, Config.DefaultDiceSize);
        assert.equal(roundPlayer.holded.total,0);
    });

    it("Card value 0", () => {
        const card = roundPlayer.getCard();
        assert.equal(card.getCell(CellType.ServiceFinalScore).value, 0);
    });

    it("Fill number", () => {
        roundPlayer.throwDice();
        roundPlayer.fillCell(CellType.Ones);

        assert.equal(roundPlayer.throwed.total,0);
        assert.equal(roundPlayer.holded.total,0);

        const playerCard = roundPlayer.getCard();
        assert.equal(playerCard.getCell(CellType.ServiceFinalScore).value, 5);

    });

    it("canHoldDie()", () => {
        roundPlayer.throwDice();
        assert.equal(roundPlayer.canHoldDie(0),true);
        assert.equal(roundPlayer.canHoldDie(1),true);
        assert.equal(roundPlayer.canHoldDie(2),true);
        assert.equal(roundPlayer.canHoldDie(3),true);
        assert.equal(roundPlayer.canHoldDie(4),true);
    });

    it("can'tFreeDice()", () => {
        roundPlayer.throwDice();
        assert.equal(roundPlayer.canFreeDie(0),false);
        assert.equal(roundPlayer.canFreeDie(1),false);
        assert.equal(roundPlayer.canFreeDie(2),false);
        assert.equal(roundPlayer.canFreeDie(3),false);
        assert.equal(roundPlayer.canFreeDie(4),false);
    });

    it("holdDie()", () => {
        roundPlayer.throwDice();
        roundPlayer.holdDie(2);
        assert.equal(roundPlayer.canHoldDie(2),false);
        assert.equal(roundPlayer.canFreeDie(0),true);

        roundPlayer.holdDie(4);
        assert.equal(roundPlayer.canHoldDie(4),false);
        assert.equal(roundPlayer.canFreeDie(1),true);

    });

    it("freeDie()", () => {
        roundPlayer.throwDice();
        roundPlayer.holdDie(2);
        roundPlayer.holdDie(4);
        assert.equal(roundPlayer.canHoldDie(2),false);
        assert.equal(roundPlayer.canFreeDie(0),true);

        roundPlayer.freeDie(0);
        assert.equal(roundPlayer.canHoldDie(2),true);
        assert.equal(roundPlayer.canFreeDie(0),false);

    });

    it("IRoundPlayerThrowObserver()", () => {
        class ThrowObserver implements IRoundPlayerThrowObserver {
            public throwed = false;
            public onPlayerThrow() {
                this.throwed = true;
            }
        }
        const observer = new ThrowObserver();
        roundPlayer.registerObserver(observer);

        assert.equal(observer.throwed, false);

        roundPlayer.throwDice();
        assert.equal(observer.throwed, true);
    });

});
