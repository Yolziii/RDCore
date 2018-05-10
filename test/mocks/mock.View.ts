import {IViewFactory} from "../../src/application/IViewFactory";
import {IMainScreenView, MainScreenController} from "../../src/application/mainScreen/MainScreenController";

export class MockViewFactory implements IViewFactory {
    public createMainScreenView():IMainScreenView {
        return new MockMainScreenView();
    }
}

export class MockMainScreenView implements IMainScreenView{
    public init(controller:MainScreenController) {
        //
    }

    public activate() {
        //
    }
}
