import * as assert from "assert";
import "mocha";
import {PDie} from "../src/model/probability/PDie";
import {round} from "../src/model/probability/round";
import RDError from "../src/model/RDError";
import {RDErrorCode} from "../src/model/RDErrorCode";
import {NumberCellProbability} from "../src/model/probability/NumberCellProbability";
import {Dice} from "../src/model/coreGameplay/dice/Dice";
import {DieType} from "../src/model/coreGameplay/dice/DieType";
import {RoyalDiceCellProbability} from "../src/model/probability/RoyalDiceCellProbability";
import {JokerDie} from "../src/model/coreGameplay/dice/JokerDie";
import {FullHouseCellProbability} from "../src/model/probability/FullHouseCellProbability";
import {combineDice, PDieCalculator} from "../calculates/PDieCalculator";

describe("Probability", () => {
    describe("Combine dice", () => {
        it("Combinations of 1-1", () => {
            assert.deepEqual(combineDice([1, 1]), [[1,1]]);
        });

        it("Combinations of 1-2", () => {
            assert.deepEqual(combineDice([2, 1]), [[1,2], [2,1]]);
        });

        it("Combinations of 1-1-2", () => {
            assert.deepEqual(combineDice([1, 1, 2]), [[1,1,2], [1,2,1], [2,1,1]]);
        });

        it("Combinations of 1-2-3", () => {
            assert.deepEqual(combineDice([1, 2, 3]), [ [1,2,3 ], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] ]);
        });
    });

    describe("Probability of combination", () => {
        it("Probability of 1-1", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(round(die.allFacesProbability(1, 1)), round(1/36));
        });

        it("Probability of 1-2", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(round(die.allFacesProbability(1, 2)), round(2/36));
        });

        it("Probability of 1-1-1", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(round(die.allFacesProbability(1, 1, 1)), round(1/216));
        });

        it("Probability of 1-1-2", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(round(die.allFacesProbability(1, 1, 2)), round(3/216));
        });

        it("Probability of 1-2-3", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(round(die.allFacesProbability(1, 2, 3)),  round(6/216));
        });
    });

    describe("Probability of template", () => {
        it("Probability of 1-1", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(round(die.templateProbability("1", "1")), round(1/36));
        });

        it("Probability of 1-X", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(round(die.templateProbability("1", "[123456]")), round(11/36));
        });

        it("Probability of 6-6-7", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(die.templateProbability("6", "6", "6"), 1/216);
        });

        it("Probability of 6-6-X", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(die.templateProbability("6", "6", "[123456]"), 16/216);
        });

        it("Probability of 6-6-!6", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(die.templateProbability("6", "6", "[12345]"), 15/216);
        });

        it("Probability of 6-!6-!6", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(die.templateProbability("6", "a|[12345]", "b|[12345]"), 75/216);
        });

        it("Probability of !6-!6-!6", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            assert.equal(die.templateProbability("a|[12345]", "b|[12345]", "c|[12345]"), 125/216);
        });

        it("Uquals templates", () => {
            const die:PDieCalculator = new PDieCalculator(6);
            try {
                die.templateProbability("6", "[123]", "[123]");
            } catch(e) {
                assert.equal((e as RDError).code, RDErrorCode.NOT_UNIQ_DIE_TEMPLATE);
            }
        });
    });

    describe("NumberCellProbability", () => {
        const fiveNumbersProbability = new PDie(6).bernulliMethod(1/6, 5, 3);
        const threeNumbersProbability = new PDie(6).bernulliMethod(1/6, 3, 3);
        const dieOne = {type: DieType.Value, value:1};

        it("Probability of ones (3)", () => {
            assert.equal(new PDieCalculator(6).templateProbability("1", "1", "1"), threeNumbersProbability);
        });

        it("Probability of ones (3) with Joker", () => {
            const pcell = new NumberCellProbability(1);

            pcell.calculate(new Dice(dieOne, JokerDie), 3);
            assert.equal(pcell.probability(), threeNumbersProbability * 3);
        });

        it("Recommended dies", () => {
            const pcell = new NumberCellProbability(1);
            pcell.calculate(new Dice(dieOne, JokerDie), 3);

            const toHold = pcell.recommendedCombinations()[0];
            assert.equal(toHold.total, 2);
            assert.equal(toHold.getFrom(0).value, 1);
            assert.equal(toHold.getFrom(1).type, DieType.Joker);
        });

        it("Probability of ones (1)", () => {
            const pcell = new NumberCellProbability(1);
            pcell.calculate(new Dice(dieOne, dieOne, dieOne, dieOne), 3);
            assert.equal(pcell.probability(), 1/6 * 3);
        });

        it("Probability of ones 0)", () => {
            const pcell = new NumberCellProbability(1);
            pcell.calculate(new Dice(dieOne, dieOne, dieOne, dieOne, dieOne), 3);
            assert.equal(pcell.probability(), 1);
        });
    });

    describe("RoyalDiceCellProbability", () => {
        const dieOne = {type: DieType.Value, value:1};
        const dieTwo = {type: DieType.Value, value:2};

        it("Probability of ones (5)", () => {
            const pcell = new RoyalDiceCellProbability();
            pcell.calculate(new Dice(), 3);
            assert.equal(pcell.probability(), 3/7776);
        });

        it("Probability of ones (4)", () => {
            const pcell = new RoyalDiceCellProbability();
            pcell.calculate(new Dice(dieOne, dieTwo), 3);
            assert.equal(pcell.probability(), 3/1296);
        });

        it("Probability of ones (0)", () => {
            const pcell = new RoyalDiceCellProbability();
            pcell.calculate(new Dice(dieOne, dieOne, dieOne, dieOne, dieOne), 3);
            assert.equal(pcell.probability(), 1);
        });

        it("Recommended dies", () => {
            const pcell = new RoyalDiceCellProbability();

            pcell.calculate(new Dice(dieOne, dieTwo, JokerDie), 3);
            const dices = pcell.recommendedCombinations();

            assert.equal(dices.length, 2);

            const die1 = dices[0];
            assert.equal(die1.total, 2);
            assert.equal(die1.getFrom(0).value, 1);
            assert.equal(die1.getFrom(1).type, DieType.Joker);

            const die2 = dices[1];
            assert.equal(die2.total, 2);
            assert.equal(die2.getFrom(0).value, 1);
            assert.equal(die2.getFrom(1).type, DieType.Joker);
        });
    });

    describe("FullHouseProbability", () => {
        const pdie:PDieCalculator = new PDieCalculator(6);
        /*it("Just calculate 5", () => {
            const allCombinations = pdie.getAllCombinations(5);

            const fullHouseCell = new FullHouseCell();
            const dies = [{type:DieType.Value, value:0}, {type:DieType.Value, value:0}, {type:DieType.Value, value:0}, {type:DieType.Value, value:0}, {type:DieType.Value, value:0}];
            const dice = new Dice(dies[0], dies[1], dies[2], dies[3], dies[4]);

            const fullHouses:string[] = [];
            let total = 0;
            for (const combination of allCombinations) {
                for (let i = 0; i < combination.length; i++) {
                    dies[i].value = combination[i];
                }
                if (fullHouseCell.valueFor(dice) !== 0) {
                    total++;
                    fullHouses.push(combination.join(""));
                }
            }

            assert.equal(total, 300);
        });*/

        it("Probability(5)", () => {
            const pcell = new FullHouseCellProbability();
            pcell.calculate(new Dice(), 1);
            assert.equal(round(pcell.probability()), round(300/7776));
        });
    });
});
