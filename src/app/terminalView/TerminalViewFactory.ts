import {IViewFactory} from "../../client/IViewFactory";
import {IMainScreenView} from "../mainScreen/MainScreenController";
import {TerminalMainScreenView} from "./TerminalMainScreenView";
import {TerminalSingleRoundView} from "./roundView/TerminalSingleRoundView";
import {IResultScreenView} from "../resultScreen/SingleResultScreenController";
import {TerminalRoundResutScreenView} from "./TerminalRoundResutScreenView";
import {IRoundView} from "../round/SingleRoundController";

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
