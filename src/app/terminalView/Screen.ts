import {ATerminalView} from "./ATerminalView";
const ansiEsc = require('ansi-escapes');

export class Screen {
    protected children:ATerminalView[] = [];

    public add(child:ATerminalView):void {
        this.children.push(child);
    }

    public remove(child:ATerminalView):void {
        let index:number = this.children.indexOf(child);
        if (index != -1) this.children.splice(index, 1);
    }

    public draw():void {
        process.stdout.write(ansiEsc.clearScreen);
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].draw();
        }
    }
}