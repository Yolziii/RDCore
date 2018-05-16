import {IViewFactory} from "../IViewFactory";
import {IMainScreenView} from "../../app/mainScreen/MainScreenController";
import {TerminalMainScreenView} from "./TerminalMainScreenView";
import {TerminalSingleRoundView} from "./roundView/TerminalSingleRoundView";
import {IResultScreenView} from "../../app/resultScreen/SingleResultScreenController";
import {TerminalRoundResutScreenView} from "./TerminalRoundResutScreenView";
import {IRoundView} from "../../app/round/SingleRoundController";

export class TerminalViewFactory implements IViewFactory {
    public createMainScreenView():IMainScreenView {
        return new TerminalMainScreenView();
    }

    public createRoundView():IRoundView {
        return new TerminalSingleRoundView(0, 0);
    }

    public createRoundResultView():IResultScreenView {
        return new TerminalRoundResutScreenView();
    }
}
