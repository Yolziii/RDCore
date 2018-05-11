import {AppState} from "../../application/Application";
import {Logger} from "../../util/Logger";
import {MainScreenController} from "./MainScreenController";
import {Protocol} from "../Protocol";

export class MainScreenState extends AppState {
    private controller:MainScreenController;

    public get destroyable():boolean {
        return false;
    }

    public init() {
        this.controller = new MainScreenController(this, this.app.viewFactory.createMainScreenView());
        this.controller.activate();
    }

    public wakeup() {
        this.controller.wakeUp();
    }

    public sleep() {
        this.controller.sleep();
    }

    public toSinglePlayer() {
        this.app.toState(Protocol.StartRound);
    }
}
