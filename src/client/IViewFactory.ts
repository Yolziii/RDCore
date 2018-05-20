import {IMainScreenView} from "../app/mainScreen/MainScreenController";
import {IRoundView} from "../app/round/SingleRoundController";
import {IResultScreenView} from "../app/resultScreen/SingleResultScreenController";

export interface IViewFactory {
    createMainScreenView():IMainScreenView;
    createRoundView():IRoundView;
    createRoundResultView():IResultScreenView;
}
