import * as assert from "assert";
import "mocha";
import {IDie, Dice, DieType, IDice} from "../src/model/coreGameplay/Dices";
import {Config} from "../src/model/Config";
import {RDErrorCode} from "../src/model/RDErrorCode";
import RDError from "../src/model/RDError";

describe("Dices", () => {
    function die1(): IDie {
        return {type: DieType.Value, value: 1};
    }

    function die2(): IDie {
        return {type: DieType.Value, value: 2};
    }

    function die3(): IDie {
        return {type: DieType.Value, value: 3};
    }

    function die4(): IDie {
        return {type: DieType.Value, value: 4};
    }

    function die5(): IDie {
        return {type: DieType.Value, value: 5};
    }

    function die6(): IDie {
        return {type: DieType.Value, value: 6};
    }

    // TODO copy();

    it("Max", () => {
        const dice: IDice = new Dice();
        assert.equal(dice.length, Config.DefaultDiceSize);
    });

    it("Zero total", () => {
        const dice: IDice = new Dice();
        assert.equal(dice.total, 0);
    });

    it("Not full", () => {
        const dice: Dice = new Dice();
        assert.equal(dice.isFull, false);
    });

    it("One total", () => {
        const dice: IDice = new Dice(die1());
        assert.equal(dice.total, 1);
    });

    it("Full", () => {
        const dice: IDice = new Dice(die1(), die2(), die3(), die4(), die5());
        assert.equal(dice.isFull, true);
    });

    it("value()", () => {
        const dice: IDice = new Dice(die1(), die2(), die3(), die4(), die5());
        assert.equal(dice.total, 5);
    });

    it("getFrom()", () => {
        const dice: IDice = new Dice(die1());
        const die: IDie = dice.getFrom(0);
        assert.equal(die.value, 1);
        assert.equal(dice.total, 1);
    });

    it("popFrom()", () => {
        const dice: IDice = new Dice(die1(), die2(), die3(), die4(), die5());
        const die: IDie = dice.popFrom(0);
        assert.equal(die.value, 1);
        assert.equal(dice.total, 4);
    });

    it("Dice.putTo()", () => {
        const dice: Dice = new Dice();

        dice.putTo(die1());
        assert.equal(dice.total, 1);

    });

    it("getFrom() unknown", () => {
        const dice: IDice = new Dice();
        try {
            dice.getFrom(0);
            assert.fail("Dice.getFrom() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_EMPTY);
            } else {
                throw e;
            }
        }
    });

    it("getFrom() unknown", () => {
        const dice: IDice = new Dice();
        try {
            dice.popFrom(0);
            assert.fail("Dice.popFrom() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_EMPTY);
            } else {
                throw e;
            }
        }
    });

    it("DiceArray.putTo() full", () => {
        const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
        try {
            dice.putTo({type: DieType.Value, value: 1});
            assert.fail("Dice.putTo() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_IF_FULL);
            } else {
                throw e;
            }
        }
    });

    it("DiceSlotable.putTo() full", () => {
        const dice: Dice = new Dice({type: DieType.Value, value: 1});
        try {
            dice.putTo({type: DieType.Value, value: 1}, 0);
            assert.fail("DiceSlotable.putTo() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_FULL);
            } else {
                throw e;
            }
        }
    });
});
