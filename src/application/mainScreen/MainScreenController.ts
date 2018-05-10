import {Application} from "../Application";
import {Protocol} from "../Protocol";

export interface IMainScreenView {
    init(controller:MainScreenController);

    activate();
    draw();

    sleep();
}

export class MainScreenController {
    private app:Application;
    private view:IMainScreenView;

    constructor(app:Application, view:IMainScreenView) {
        this.app = app;
        this.view = view;
        view.init(this);
    }

    public activate() {
        this.view.activate();
    }

    public wakeUp() { // TODO:
        this.view.activate();
    }

    public sleep() {
        this.view.sleep();
    }

    public onSingleRound() {
        this.app.toState(Protocol.StartRound);
    }
}
