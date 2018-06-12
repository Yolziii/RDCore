export class PDie {
    private _faces:number;

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
        // TODO: Проверять список граней на уникальность
        let probability = 0;
        for (const face of faces) {
            probability += this.faceProbability(face);
        }

        return probability;
    }

    public templateProbability2(...template:string[]):number {
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
            if (words.indexOf(word) === -1) {
                words.push(word);
            }
        }

        // Если в шаблоне не нашлось символов для замены, то просто возвращаем вероятность для комбинации
        if (words.length === 0) {
            return this.allProbability(faces);
        }

        const templateCombination = [];
        for (let i = 0; i < template.length; i++) {
            templateCombination.push(i);
        }
        const allTemplateCombinations = calculateCombinations(templateCombination);
        const regexps = [];
        for (const tc of allTemplateCombinations) {
            let reg = "";
            for (const i of tc) {
                reg += regs[i];
            }
            regexps.push(new RegExp(reg,"im"));
        }

        // Генерируем все возможные комбинации для указанного количества костей
        const combs:number[][] = findCombinationsWithRepetitions(6, template.length);
        const allCombinations:number[][] = [];
        for (const comb of combs) {
            const newCombs = calculateCombinations(comb);
            for (const newComb of newCombs) {
                add(newComb, allCombinations);
            }
        }

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

        return Math.pow(this.faceProbability(1), template.length) * total;
    }

    /**
     * Вероятность одновременного выпадания указанных граней в любой последовательности (на соответствующем количестве костей)
     * @returns {number} 0-1
     */
    public allFacesProbability(...faces:number[]):number {
       return this.allProbability(faces);
    }

    private allProbability(faces:number[]):number {
        const totalCombs = calculateCombinations(faces).length;
        return Math.pow(this.faceProbability(1), faces.length) * totalCombs;
    }
}

let facts:number[] = [];
let combinations:number[][] = [];

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
export const calculateCombinations = function(faces:number[]):number[][] {
    const sortedFaces = faces.sort(this.sortNumbers);

    facts = [];
    combinations = [sortedFaces];

    for (let i = 0; i < fact(sortedFaces.length); i++) {
        add(permutation(i, sortedFaces.slice(0)), combinations);
    }

    return combinations;
};

function nextSet(a:number[], n:number, m:number) {
    let j:number = m - 1;
    while (j >= 0 && a[j] === n) {
        j--;
    }
    if (j < 0) {
        return false;
    }
    if (a[j] >= n) {
        j--;
    }
    a[j]++;
    if (j === m - 1) {
        return true;
    }
    for (let k = j + 1; k < m; k++) {
        a[k] = 1;
    }
    return true;
}

let findedCombinations:number[][] = [];

function findCombinationsWithRepetitions(n:number, m:number) {
    const a:number[] = [];
    findedCombinations = [];

    const h:number = n > m ? n : m;
    for (let i = 0; i < h; i++) {
        a[i] = 1;
    }

    add(a, findedCombinations, m);

    while (nextSet(a, n, m)) {
        add(a, findedCombinations, m);
    }

    return findedCombinations;
}
