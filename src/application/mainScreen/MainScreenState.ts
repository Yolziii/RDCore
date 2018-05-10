import {AppState} from "../Application";
import {Logger} from "../../util/Logger";
import {MainScreenController} from "./MainScreenController";

export class MainScreenState extends AppState {
    private controller:MainScreenController;

    public get destroyable():boolean {
        return false;
    }

    public activate() {
        this.controller = new MainScreenController(this.app, this.app.viewFactory.createMainScreenView());
        this.controller.activate();

    }

    public wakeup() {
        this.controller.wakeUp();
    }

    public sleep() {
        this.controller.sleep();
    }
}
