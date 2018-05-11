import {IMainScreenView} from "./mainScreen/MainScreenController";
import {IRoundView} from "./round/RoundController";

export interface IViewFactory {
    createMainScreenView():IMainScreenView;
    createRoundView():IRoundView;
}
