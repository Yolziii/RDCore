// tslint:disable-next-line:no-var-requires
const ansiEsc = require("ansi-escapes");
// tslint:disable-next-line:no-var-requires
const readline = require("readline");

export abstract class ATerminalView {
    protected x: number;
    protected y: number;

    private lineOffset: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public abstract draw(): void;

    protected startDraw() {
        readline.cursorTo(process.stdout, this.x, this.y);
        this.lineOffset = 0;
    }

    protected line(str: string) {
        const log = console.log;
        log(str);
        this.lineOffset++;
        readline.cursorTo(process.stdout, this.x, this.y + this.lineOffset);
    }

    protected place(str: string, x:number, y:number) {
        readline.cursorTo(process.stdout, x, y);
        const log = console.log;
        log(str);

    }
}
