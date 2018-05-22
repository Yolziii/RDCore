import {SingleRoundController} from "./SingleRoundController";
import {IRound} from "../../../model/coreGameplay/round/IRound";

export interface IRoundView {
    init(controller:SingleRoundController);

    activate(model:IRound);
    draw();
    exit();

    enableThrowButton();
    disableThrowButton();

    enableCells();
    disableCells();
}
