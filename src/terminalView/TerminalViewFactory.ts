import {IViewFactory} from "../application/IViewFactory";
import {IMainScreenView} from "../application/mainScreen/MainScreenController";
import {TerminalMainScreenView} from "./TerminalMainScreenView";
import {IRoundView} from "../application/round/RoundController";
import {TerminalSingleRoundView} from "./roundView/TerminalSingleRoundView";

export class TerminalViewFactory implements IViewFactory {
    public createMainScreenView():IMainScreenView {
        return new TerminalMainScreenView();
    }

    public createRoundView():IRoundView {
        return new TerminalSingleRoundView(0, 0);
    }
}