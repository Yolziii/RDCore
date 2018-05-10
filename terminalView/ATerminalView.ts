export abstract class TerminalViewComponent {
    protected _x:number;
    protected _y:number;

    constructor(x:number, y:number) {
        this._x = x;
        this._y = x;
    }

    abstract draw():void;
}