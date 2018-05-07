import * as assert from "assert";
import "mocha";
import {IRoundPlayer, IRoundPlayerThrowObserver, RoundPlayerCard1} from "../src/core/Rounds";
import {Card, ICard} from "../src/core/Cards";
import {CellType, FinalScoreCell, NumberCell} from "../src/core/Cells";
import {Config} from "../src/core/Config";
import {Thrower} from "../src/core/round/Thrower";
import {Dice, DieType, IDice, IDie} from "../src/core/Dices";

describe("RoundPlayerCard1", () => {
    class TestThrower extends Thrower {
        protected diceFactory() {
            const DIE1:IDie = {type:DieType.Value, value: 1};
            return new Dice(DIE1, DIE1, DIE1, DIE1, DIE1);
        }

        protected fillDie(dice:IDice, index:number) {
            // tslint:disable-next-line
        }
    }

    const testThrower = new TestThrower();
    let roundPlayer:RoundPlayerCard1;

    beforeEach(() => {
        const card:ICard = new Card([
            new NumberCell(CellType.Ones, 1),

            new FinalScoreCell()
        ]);

        roundPlayer = new RoundPlayerCard1();
        roundPlayer.init(card, testThrower);
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
        assert.equal(roundPlayer.canFreeDice(0),false);
        assert.equal(roundPlayer.canFreeDice(1),false);
        assert.equal(roundPlayer.canFreeDice(2),false);
        assert.equal(roundPlayer.canFreeDice(3),false);
        assert.equal(roundPlayer.canFreeDice(4),false);
    });

    it("holdDie()", () => {
        roundPlayer.throwDice();
        roundPlayer.holdDie(2);
        assert.equal(roundPlayer.canHoldDie(2),false);
        assert.equal(roundPlayer.canFreeDice(0),true);

        roundPlayer.holdDie(4);
        assert.equal(roundPlayer.canHoldDie(4),false);
        assert.equal(roundPlayer.canFreeDice(1),true);

    });

    it("holdDie()", () => {
        roundPlayer.throwDice();
        roundPlayer.holdDie(2);
        roundPlayer.holdDie(4);
        assert.equal(roundPlayer.canHoldDie(2),false);
        assert.equal(roundPlayer.canFreeDice(0),true);

        roundPlayer.freeDie(0);
        assert.equal(roundPlayer.canHoldDie(2),true);
        assert.equal(roundPlayer.canFreeDice(0),false);

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
