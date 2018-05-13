import {IMainScreenView} from "./mainScreen/MainScreenController";
import {IRoundView} from "./round/RoundController";
import {IResultScreenView} from "./resultScreen/SingleResultScreenController";

export interface IViewFactory {
    createMainScreenView():IMainScreenView;
    createRoundView():IRoundView;
    createRoundResultView():IResultScreenView;
}
