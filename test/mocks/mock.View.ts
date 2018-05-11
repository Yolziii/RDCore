import {IViewFactory} from "../../src/client/IViewFactory";
import {IMainScreenView, MainScreenController} from "../../src/client/mainScreen/MainScreenController";
import {IRoundView, RoundController} from "../../src/client/round/RoundController";
import {IRound} from "../../src/core/Rounds";

export class MockViewFactory implements IViewFactory {
    public createMainScreenView():IMainScreenView {
        return new MockMainScreenView();
    }

    public createRoundView():IRoundView {
        return new MockRoundView();
    }
}

export class MockMainScreenView implements IMainScreenView {
    public init(controller:MainScreenController) {/**/}

    public activate() {/**/}
    public draw() {/**/}

    public sleep() {/**/}
}

export class MockRoundView implements  IRoundView {
    public init(controller:RoundController) {/**/}

    public activate(model:IRound) {/**/}
    public draw() {/**/}
    public exit() {/**/}

    public enableThrowButton() {/**/}
    public disableThrowButton() {/**/}

    public enableCells() {/**/}
    public disableCells() {/**/}
}
