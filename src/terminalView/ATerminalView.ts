const ansiEsc = require('ansi-escapes');

export abstract class ATerminalView {
    protected _x:number;
    protected _y:number;
    private lineOffset:number = 0;

    constructor(x:number, y:number) {
        this._x = x;
        this._y = x;
    }

    abstract draw():void;

    protected  startDraw() {
        ansiEsc.cursorTo(this._x, this._y);
        this.lineOffset = 0;
    }

    protected line(string) {
        console.log(string);
        this.lineOffset++;
        ansiEsc.cursorTo(this._x, this._y + this.lineOffset);
    }
}