import {IMainScreenView} from "./mainScreen/MainScreenController";
import {IResultScreenView} from "./resultScreen/SingleResultScreenController";
import {IRoundView} from "./round/SingleRoundController";

export interface IViewFactory {
    createMainScreenView():IMainScreenView;
    createRoundView():IRoundView;
    createRoundResultView():IResultScreenView;
}
