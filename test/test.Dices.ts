import * as assert from "assert";
import "mocha";
import {DieType, IDice, IDie} from "../src/core/gameplay";
import {Dice, FullDiceDecorator} from "../src/core/Dices";
import {Config} from "../src/core/Config";
import {RDError, RDErrorCode} from "../src/core/RDError";

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

    it("Max", () => {
        const dice: Dice = new Dice();
        assert.equal(dice.max(), Config.DefaultDiceSize);
    });

    it("Zero total", () => {
        const dice: Dice = new Dice();
        assert.equal(dice.total(), 0);
    });

    it("Not full", () => {
        const dice: Dice = new Dice();
        assert.equal(dice.isFull(), false);
    });

    it("One total", () => {
        const dice: Dice = new Dice(die1());
        assert.equal(dice.total(), 1);
    });

    it("Full", () => {
        const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
        assert.equal(dice.isFull(), true);
    });

    it("value()", () => {
        const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
        assert.equal(dice.total(), 5);
    });

    it("get()", () => {
        const dice: Dice = new Dice(die1());
        const die: IDie = dice.get(0);
        assert.equal(die.value, 1);
        assert.equal(dice.total(), 1);
    });

    it("pop()", () => {
        const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
        const die: IDie = dice.pop(0);
        assert.equal(die.value, 1);
        assert.equal(dice.total(), 4);
    });

    it("Dice.put()", () => {
        const dice: Dice = new Dice();

        dice.put(die1());
        assert.equal(dice.total(), 1);

    });

    it("get() unknown", () => {
        const dice: Dice = new Dice();
        try {
            dice.get(0);
            assert.fail("Dice.get() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_EMPTY);
            } else {
                throw e;
            }
        }
    });

    it("get() unknown", () => {
        const dice: Dice = new Dice();
        try {
            dice.pop(0);
            assert.fail("Dice.pop() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_EMPTY);
            } else {
                throw e;
            }
        }
    });

    it("DiceArray.put() full", () => {
        const dice: Dice = new Dice(die1(), die2(), die3(), die4(), die5());
        try {
            dice.put({type: DieType.Value, value: 1});
            assert.fail("Dice.put() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_IF_FULL);
            } else {
                throw e;
            }
        }
    });

    it("DiceSlotable.put() full", () => {
        const dice: Dice = new Dice({type: DieType.Value, value: 1});
        try {
            dice.put({type: DieType.Value, value: 1}, 0);
            assert.fail("DiceSlotable.put() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_INDEX_FULL);
            } else {
                throw e;
            }
        }
    });

    it("FullDiceDecorator exeption", () => {
        const dice: IDice = new FullDiceDecorator(new Dice({type: DieType.Value, value: 1}));
        try {
            dice.get(0);
            assert.fail("FullDiceDecorator.get() don't throw exception!");
        } catch (e) {
            if (e instanceof RDError) {
                assert.equal(e.code, RDErrorCode.DICE_NOT_FULL);
            } else {
                throw e;
            }
        }
    });

    it("FullDiceDecorator ok", () => {
        const dice: IDice = new FullDiceDecorator(
            new Dice(die1(), die2(), die3(), die4(), die5()),
        );

        const die: IDie = dice.get(0);
        assert.equal(die.value, 1);
    });
});
