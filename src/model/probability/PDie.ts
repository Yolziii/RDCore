import RDError from "../RDError";
import {RDErrorCode} from "../RDErrorCode";

export class PDie {
    protected _faces:number;

    public constructor(faces:number) {
        this._faces = faces;
    }

    /**
     * Вероятность выпадания указанной грани
     * @returns {number} 0-1
     */
    public faceProbability(face:number):number {
        if (face > 0 && face <= this._faces && Math.floor(face) === face) {
            return 1 / this._faces;
        }
        return 0;
    }

    /**
     * Вероятность выпадания одной из указанных граней
     * @returns {number} 0-1
     */
    public oneOfFacesProbability(...faces:number[]):number {
        for (let i = 0; i<faces.length; i++) {
            if (faces.indexOf(faces[i], i+1) !== -1) {
                throw new RDError(RDErrorCode.NOT_UNIQ_DIE);
            }
        }

        let probability = 0;
        for (const face of faces) {
            probability += this.faceProbability(face);
        }

        return probability;
    }

    /**
     * Вычисляет вероятность по формуле Бернулли. Применима, если речь в событии идет не о сумме,
     * произведении и т.п. интегральных характеристиках, а лишь о количестве выпадений определенного типа
     * @param {number} p - вероятность выпаденпия ожидаемого события для одной кости
     * @param {number} n - количество бросаемых костей
     * @param {number} k - сколько раз должно произойти желаемое событие
     * @returns {number}
     */
    public bernulliMethod(p:number, n:number, k:number):number {
        return (factorial(n) / (factorial(k) * factorial(n-k))) * Math.pow(p, k) * Math.pow(1-p, n-k);
    }

    /**
     * Вычисляет количество сочетаний из n по k (без повторений - элементы не повторяются)
     * @param {number} k - сколько бросаем кубиков
     * @returns {number}
     */
    public combinations(k:number):number {
        const n:number = this._faces;
        return factorial(n) / (factorial(k) * factorial(n-k));
    }

    /**
     * Вычисляет количество сочетаний из n по k (с повторениями - элементы могут повторяться)
     * @param {number} k - сколько бросаем кубиков
     * @returns {number}
     */
    public repeatedCombinations(k:number):number {
        const n:number = this._faces;
        return factorial(n + k - 1) / (factorial(k) * factorial(n-1));
    }

    /**
     * Возвращает количество размещений при бросании кубика k раз без повторений
     * @param {number} k
     * @returns {number}
     */
    public accomodation(k:number):number {
        const n = this._faces;

        return factorial(n) / factorial(n - k);
    }

    /**
     * Возвращает количество размещений при бросании кубика k раз c повторениями
     * @param {number} k
     * @returns {number}
     */
    public repeatedAccomodation(k:number):number {
        const n = this._faces;
        return Math.pow(n, k);
    }
}

function factorial(num) {
    let result = num;

    if (num === 0 || num === 1) {
        return 1;
    }

    while (num > 1) {
        num--;
        result = result * num;
    }

    return result;
}
