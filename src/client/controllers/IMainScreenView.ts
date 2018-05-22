import {MainScreenController} from "./MainScreenController";

export interface IMainScreenView {
    init(controller:MainScreenController);

    activate();
    draw();

    sleep();
}
