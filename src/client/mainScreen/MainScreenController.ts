import {MainScreenState} from "./MainScreenState";

export interface IMainScreenView {
    init(controller:MainScreenController);

    activate();
    draw();

    sleep();
}

export class MainScreenController {
    private state:MainScreenState;
    private view:IMainScreenView;

    constructor(state:MainScreenState, view:IMainScreenView) {
        this.state = state;
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
        this.state.toSinglePlayer();
    }

    public onSingleJokerRound() {
        this.state.toSingleJokerRound();
    }

    public onTripleRound() {
        this.state.toSingleTripleRound();
    }
}
