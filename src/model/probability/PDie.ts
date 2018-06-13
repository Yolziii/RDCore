import RDError from "../RDError";
import {RDErrorCode} from "../RDErrorCode";

export class PDie {
    private _faces:number;

    private allCombinations = {};

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
     * Вероятность выпадания комбинации, соответствущей указанному шаблону.
     * Каждый элемент шаблона может бить или конкретным числом или частью регулярного выражения, описывающим одно число
     * @param {string} template
     * @returns {number}
     */
    public templateProbability(...template:string[]):number {
        // Составляем словарь уникальных символов
        const words:string[] = [];
        const faces:number[] = [];
        const regs = [];
        for (const word of template) {
            const separator = word.indexOf("|");
            if (separator === -1) {
                regs.push(word);
            } else {
                regs.push(word.substr(separator + 1));
            }

            if ((+word).toString() === word) {
                faces.push(+word);
                continue;
            }
            if (words.indexOf(word) !== -1) {
                throw new RDError(RDErrorCode.NOT_UNIQ_DIE_TEMPLATE);
            }

            words.push(word);
        }

        // Если в шаблоне не нашлось символов для замены, то просто возвращаем вероятность для комбинации
        if (words.length === 0) {
            return this.allProbability(faces);
        }

        // Составляем проверочные регулярные выражения
        const initialOrder = [];
        for (let i = 0; i < template.length; i++) {
            initialOrder.push(i);
        }
        const allOrders = combineDice(initialOrder);
        const regexps = [];
        for (const regOrder of allOrders) {
            let reg = "";
            for (const i of regOrder) {
                reg += regs[i];
            }
            regexps.push(new RegExp(reg,"im"));
        }

        // Сравниваем каждую комбинацию с получившимися шаблонами
        const allCombinations = this.getAllCombinations(template.length);
        let total = 0;
        for (const comb of allCombinations) {
            let find = false;
            const toFind = comb.join("");
            for (const regexp of regexps) {
                if (regexp.test(toFind)) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                // console.log(comb.join() + " - MISS");
                continue;
            }

            // console.log(comb.join() + " - ok");
            total++;
        }

        return total / allCombinations.length;
    }

    /**
     * Вероятность одновременного выпадания указанных граней в любой последовательности (на соответствующем количестве костей)
     * @returns {number} 0-1
     */
    public allFacesProbability(...faces:number[]):number {
       return this.allProbability(faces);
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

    private allProbability(faces:number[]):number {
        const totalCombs = combineDice(faces).length;
        return Math.pow(this.faceProbability(1), faces.length) * totalCombs;
    }

    private getAllCombinations(totalDies:number):number[][] {
        if (this.allCombinations[totalDies] == null) {
            const candidates:number[][] = generateRepeatedDices(6, totalDies);
            const combinations:number[][] = [];
            for (const comb of candidates) {
                const newCombs = combineDice(comb);
                for (const newComb of newCombs) {
                    add(newComb, combinations);
                }
            }

            this.allCombinations[totalDies] = combinations;
        }
        return this.allCombinations[totalDies];
    }
}

let facts:number[] = [];
let combinedDices:number[][] = [];
let repeatedDices:number[][] = [];

function fact(n):number {
    if (n === 0 || n === 1) {
        return 1;
    }
    if (facts[n]) {
        return facts[n];
    }
    facts[n] = n * fact(n-1);
    return facts[n];
}

function permutation(index, a) {
    const n = a.length;
    let i = index + 1;
    const res = [];
    for (let t = 1; t <= n; t++) {
        const f = fact(n-t);
        const k = Math.floor((i + f - 1) / f);
        res.push(a.splice(k-1, 1)[0]);
        i -= (k - 1) * f;
    }
    if (a.length) {
        res.push(a[0]);
    }
    return res;
}

function add(candidate, list, length=0) {
    if (!exists(candidate, list, length)) {
        if (length === 0) {
            length = candidate.length;
        }
        list.push(candidate.slice(0, length));
    }
}

function exists(candidate, list, length=0) {
    if (length === 0) {
        length = candidate.length;
    }
    for (const combination of list) {
        let totalEquals = 0;
        for (let j = 0; j < length; j++) {
            if (candidate[j] === combination[j]) {
                totalEquals++;
            }
        }
        if (totalEquals === length) {
            return true;
        }
    }
    return false;
}

function sortNumbers(a:number, b:number):number {
    if (a === b) {
        return 0;
    }
    return a > b ? 1 : -1;
}

/**
 * Возвращает все комбинации указанных граней
 * @returns {number[][]}
 */
export const combineDice = function(faces:number[]):number[][] {
    const sortedFaces = faces.sort(this.sortNumbers);

    facts = [];
    combinedDices = [sortedFaces];

    for (let i = 0; i < fact(sortedFaces.length); i++) {
        add(permutation(i, sortedFaces.slice(0)), combinedDices);
    }

    return combinedDices;
};

function next(set:number[], n:number, m:number) {
    let j:number = m - 1;
    while (j >= 0 && set[j] === n) {
        j--;
    }
    if (j < 0) {
        return false;
    }
    if (set[j] >= n) {
        j--;
    }
    set[j]++;
    if (j === m - 1) {
        return true;
    }
    for (let k = j + 1; k < m; k++) {
        set[k] = 1;
    }
    return true;
}

function generateRepeatedDices(n:number, m:number) {
    const set:number[] = [];
    repeatedDices = [];

    const h:number = n > m ? n : m;
    for (let i = 0; i < h; i++) {
        set[i] = 1;
    }

    add(set, repeatedDices, m);

    while (next(set, n, m)) {
        add(set, repeatedDices, m);
    }

    return repeatedDices;
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
