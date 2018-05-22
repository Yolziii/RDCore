import {IViewFactory} from "../../src/client/IViewFactory";
import {IMainScreenView, MainScreenController} from "../../src/client/controllers/MainScreenController";
import {SingleRoundController} from "../../src/client/controllers/round/SingleRoundController";
import {IResultScreenController, IResultScreenView} from "../../src/client/controllers/resultScreen/SingleResultScreenController";
import {IRoundView} from "../../src/client/controllers/round/IRoundView";
import {IRound} from "../../src/model/coreGameplay/round/IRound";

export class MockViewFactory implements IViewFactory {
    public createMainScreenView():IMainScreenView {
        return new MockMainScreenView();
    }

    public createRoundView():IRoundView {
        return new MockRoundView();
    }

    public createRoundResultView():IResultScreenView {
        return new MockResultScreenView();
    }
}

export class MockMainScreenView implements IMainScreenView {
    public init(controller:MainScreenController) {/**/}

    public activate() {/**/}
    public draw() {/**/}

    public sleep() {/**/}
}

export class MockRoundView implements  IRoundView {
    public init(controller:SingleRoundController) {/**/}

    public activate(model:IRound) {/**/}
    public draw() {/**/}
    public exit() {/**/}

    public enableThrowButton() {/**/}
    public disableThrowButton() {/**/}

    public enableCells() {/**/}
    public disableCells() {/**/}
}

export class MockResultScreenView implements IResultScreenView {
    public  init(controller:IResultScreenController) {/**/}
    public activate(model) {/**/}
    public sleep() {/**/}
}
