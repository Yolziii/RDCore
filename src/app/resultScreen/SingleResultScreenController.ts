import {SingleResultScreenState} from "./SingleResultScreenState";
import {IRound} from "../../model/coreGameplay/round/Rounds";

export interface IResultScreenView {
    init(controller:IResultScreenController);
    activate(model);
    sleep();
}

export interface IResultScreenController {
    activate(model:IRound);
    onClose();
}

export class SingleResultScreenController implements IResultScreenController {
    private state:SingleResultScreenState;
    private view:IResultScreenView;

    constructor(state:SingleResultScreenState, view:IResultScreenView) {
        this.state = state;
        this.view = view;

        this.view.init(this);
    }

    public activate(model:IRound) {
        this.view.activate(model);
    }

    public sleep() {
        this.view.sleep();
    }

    public onClose() {
        this.state.closeScreen();
    }
}
