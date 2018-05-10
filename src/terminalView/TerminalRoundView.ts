// tslint:disable-next-line:no-var-requires
import {ATerminalView} from "./ATerminalView";

const ansiEsc = require("ansi-escapes");

import {IRoundView, RoundController} from "../application/round/RoundController";
import {
    IRound, IRoundPlayerFillObserver, IRoundPlayerFreeObserver, IRoundPlayerHoldObserver,
    IRoundPlayerThrowObserver
} from "../core/Rounds";
import {TerminalThrowButton} from "./ThrowButton";
import chalk from "chalk";

export class TerminalRoundView extends ATerminalView implements
        IRoundView, IRoundPlayerThrowObserver, IRoundPlayerHoldObserver, IRoundPlayerFreeObserver, IRoundPlayerFillObserver {
    private controller:RoundController;
    private model:IRound;

    private throwButton:TerminalThrowButton;

    public init(controller:RoundController) {
        this.controller = controller;

        this.throwButton = new TerminalThrowButton(20, 20);
    }

    public activate(model:IRound) {
        this.model = model;

        model.registerObserver(this);
        this.draw();
    }

    public draw(): void {
        process.stdout.write(ansiEsc.clearScreen);

        const log = console.log;
        log("");

        this.throwButton.draw();
    }

    public exit() {
        this.model.unregisterObserver(this);
    }

    public onPlayerThrow() {
        //
    }

    public onPlayerHold() {
        //
    }

    public onPlayerFree() {
        //
    }

    public onPlayerFill() {
        //
    }

    public enableThrowButton() {
        //
    }

    public disableThrowButton() {
        //
    }
}
