import {SingleResultScreenState} from "./SingleResultScreenState";
import {IResultScreenController} from "./IResultScreenController";
import {IResultScreenView} from "./IResultScreenView";
import {IRound} from "../../../../model/coreGameplay/round/IRound";

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
