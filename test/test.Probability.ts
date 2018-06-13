import * as assert from "assert";
import "mocha";
import {combineDice, PDie} from "../src/model/probability/PDie";
import {round} from "../src/model/probability/round";
import RDError from "../src/model/RDError";
import {RDErrorCode} from "../src/model/RDErrorCode";

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

    describe("Combinations", () => {
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
});
