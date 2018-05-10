import {Application} from "../Application";
import {
    IRound, IRoundPlayerFillObserver, IRoundPlayerFreeObserver, IRoundPlayerHoldObserver,
    IRoundPlayerThrowObserver
} from "../../core/Rounds";

export interface IRoundView {
    init(controller:RoundController);

    activate(model:IRound);
    exit();

    enableThrowButton();
    disableThrowButton();

}
// IRoundPlayerThrowObserver | IRoundPlayerHoldObserver | IRoundPlayerFreeObserver | IRoundPlayerFillObserver
export class RoundController  {
    private app:Application;
    private model:IRound;
    private view:IRoundView;

    constructor(app:Application, view:IRoundView) {
        this.app = app;
        this.view = view;

        this.view.init(this);
    }

    public activate(model:IRound) {
        this.model = model;

        this.view.activate(model);
    }

    public exit() {
        this.view.exit();
    }
}
