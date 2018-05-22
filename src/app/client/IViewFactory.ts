import {IRoundView} from "./controllers/round/IRoundView";
import {IResultScreenView} from "./controllers/resultScreen/IResultScreenView";
import {IMainScreenView} from "./controllers/IMainScreenView";

export interface IViewFactory {
    createMainScreenView():IMainScreenView;
    createRoundView():IRoundView;
    createRoundResultView():IResultScreenView;
}
