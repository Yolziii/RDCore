import {IViewFactory} from "../IViewFactory";
import {TerminalMainScreenView} from "./TerminalMainScreenView";
import {TerminalSingleRoundView} from "./roundView/TerminalSingleRoundView";
import {TerminalRoundResutScreenView} from "./TerminalRoundResutScreenView";
import {IRoundView} from "../controllers/round/IRoundView";
import {IResultScreenView} from "../controllers/resultScreen/IResultScreenView";
import {IMainScreenView} from "../controllers/IMainScreenView";

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
