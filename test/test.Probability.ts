import * as assert from "assert";
import "mocha";
import {combineDice, PDie} from "../src/model/probability/PDie";
import {round} from "../src/model/probability/round";
import RDError from "../src/model/RDError";
import {RDErrorCode} from "../src/model/RDErrorCode";
import {NumberCellProbability} from "../src/model/probability/NumberCellProbability";
import {Dice} from "../src/model/coreGameplay/dice/Dice";
import {DieType} from "../src/model/coreGameplay/dice/DieType";
import {RoyalDiceCellProbability} from "../src/model/probability/RoyalDiceCellProbability";
import {JokerDie} from "../src/model/coreGameplay/dice/JokerDie";

describe("Probability", () => {
    describe("One die", () => {
        it("Probability of 0", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(0)), 0);
        });

        it("Probability of 7", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(7)), 0);
        });

        it("Probability of 1", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(1)), round(1/6));
        });

        it("Probability of 6", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.faceProbability(6)), round(1/6));
        });
    });

    describe("Few die", () => {
        it("Probability of two dices", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2)), round(2/6));
        });

        it("Probability of three dices", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3)), round(3/6));
        });

        it("Probability of four", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3, 4)), round(4/6));
        });

        it("Probability of five", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3, 4, 5)), round(5/6));
        });

        it("Probability of six", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.oneOfFacesProbability(1, 2, 3, 4, 5, 6)), 1);
        });

        it("Not unique faces", () => {
            const die:PDie = new PDie(6);
            try {
                die.oneOfFacesProbability(1, 1);
                assert.equal(true, false);
            } catch (e) {
                assert.equal((e as RDError).code, RDErrorCode.NOT_UNIQ_DIE);
            }
        });
    });

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
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 1)), round(1/36));
        });

        it("Probability of 1-2", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 2)), round(2/36));
        });

        it("Probability of 1-1-1", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 1, 1)), round(1/216));
        });

        it("Probability of 1-1-2", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 1, 2)), round(3/216));
        });

        it("Probability of 1-2-3", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.allFacesProbability(1, 2, 3)),  round(6/216));
        });
    });

    describe("Probability of template", () => {
        it("Probability of 1-1", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.templateProbability("1", "1")), round(1/36));
        });

        it("Probability of 1-X", () => {
            const die:PDie = new PDie(6);
            assert.equal(round(die.templateProbability("1", "[123456]")), round(11/36));
        });

        it("Probability of 6-6-7", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability("6", "6", "6"), 1/216);
        });

        it("Probability of 6-6-X", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability("6", "6", "[123456]"), 16/216);
        });

        it("Probability of 6-6-!6", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability("6", "6", "[12345]"), 15/216);
        });

        it("Probability of 6-!6-!6", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability("6", "a|[12345]", "b|[12345]"), 75/216);
        });

        it("Probability of !6-!6-!6", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.templateProbability("a|[12345]", "b|[12345]", "c|[12345]"), 125/216);
        });

        it("Uquals templates", () => {
            const die:PDie = new PDie(6);
            try {
                die.templateProbability("6", "[123]", "[123]");
            } catch(e) {
                assert.equal((e as RDError).code, RDErrorCode.NOT_UNIQ_DIE_TEMPLATE);
            }
        });
    });

    describe("Combination, accomodation", () => {
        it("Accomodation", () => {
            const die:PDie = new PDie(6);

            assert.equal(die.accomodation(1), 6);
            assert.equal(die.accomodation(2), 30);
            assert.equal(die.accomodation(3), 120);
            assert.equal(die.accomodation(4), 360);
            assert.equal(die.accomodation(5), 720);
        });

        it("Repeated accomodation", () => {
            const die:PDie = new PDie(6);

            assert.equal(die.repeatedAccomodation(1), 6);
            assert.equal(die.repeatedAccomodation(2), 36);
            assert.equal(die.repeatedAccomodation(3), 216);
            assert.equal(die.repeatedAccomodation(4), 1296);
            assert.equal(die.repeatedAccomodation(5), 7776);
        });

        it("Combinations", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.combinations(1), 6);
            assert.equal(die.combinations(2), 15);
            assert.equal(die.combinations(3), 20);
            assert.equal(die.combinations(4), 15);
            assert.equal(die.combinations(5), 6);
            assert.equal(die.combinations(6), 1);
        });

        it("Combinations with repetition", () => {
            const die:PDie = new PDie(6);
            assert.equal(die.repeatedCombinations(1), 6);
            assert.equal(die.repeatedCombinations(2), 21);
            assert.equal(die.repeatedCombinations(3), 56);
            assert.equal(die.repeatedCombinations(4), 126);
            assert.equal(die.repeatedCombinations(5), 252);
            assert.equal(die.repeatedCombinations(6), 462);
        });
    });

    describe("Bernulli method", () => {
        it("Probability of 1-1", () => {
            const die:PDie = new PDie(6);
            const p = 1/6; // Вероятность выпадения единицы - 1/6
            const n = 2; // Бросаем 2 кубика
            const k = 2; // Единица долджна выпасть 2 раза

            assert.equal(round(die.bernulliMethod(p, n, k)), round(1/36));
        });

        it("Probability of 1-1-1-1-X", () => {
            const die:PDie = new PDie(6);
            const p = 1/6; // вероятность события для одной кости
            const n = 5; // бросков кубика
            const k = 4; // сколько раз должно повториться событие

            assert.equal(round(die.bernulliMethod(p, n, k)), round(25/7776));
            // assert.equal(round(die.templateProbability("1", "1", "1", "1", "[23456]")), round(25/7776));
        });

        it("Probability of !6-!6-!6", () => {
            const die:PDie = new PDie(6);
            const p = 5/6; // вероятность события для одной кости
            const n = 3; // бросков кубика
            const k = 3; // сколько раз должно повториться событие

            assert.equal(round(die.bernulliMethod(p, n, k)), round(125/216));
            // assert.equal(die.templateProbability("a|[12345]", "b|[12345]", "c|[12345]"), 125/216);
        });
    });

    describe("NumberCellProbability", () => {
        const fiveNumbersProbability = new PDie(6).bernulliMethod(1/6, 5, 3);
        const threeNumbersProbability = new PDie(6).bernulliMethod(1/6, 3, 3);
        const dieOne = {type: DieType.Value, value:1};

        it("Probability of ones (5)", () => {
            const pcell = new NumberCellProbability(1);

            pcell.calculate(new Dice(), 3);
            assert.equal(pcell.probability(), fiveNumbersProbability * 3);
            // assert.equal(new PDie(6).templateProbability("1", "1", "1", "b|[23456]"),  new PDie(6).bernulliMethod(1/6, 4, 3));
        });

        it("Probability of ones (3)", () => {
            const pcell = new NumberCellProbability(1);

            pcell.calculate(new Dice(dieOne, dieOne), 3);
            assert.equal(pcell.probability(), threeNumbersProbability * 3);
            assert.equal(new PDie(6).templateProbability("1", "1", "1"), threeNumbersProbability);
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
});
