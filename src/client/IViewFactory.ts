import {IMainScreenView} from "../app/mainScreen/MainScreenController";
import {IResultScreenView} from "../app/resultScreen/SingleResultScreenController";
import {IRoundView} from "../app/round/SingleRoundController";

export interface IViewFactory {
    createMainScreenView():IMainScreenView;
    createRoundView():IRoundView;
    createRoundResultView():IResultScreenView;
}
