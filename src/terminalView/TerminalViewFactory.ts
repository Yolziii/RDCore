import {IViewFactory} from "../application/IViewFactory";
import {IMainScreenView} from "../application/mainScreen/MainScreenController";
import {TerminalMainScreenView} from "./TerminalMainScreenView";
import {IRoundView} from "../application/round/RoundController";
import {TerminalRoundView} from "./TerminalRoundView";

export class TerminalViewFactory implements IViewFactory {
    public createMainScreenView():IMainScreenView {
        return new TerminalMainScreenView();
    }

    public createRoundView():IRoundView {
        return new TerminalRoundView(0, 0);
    }
}