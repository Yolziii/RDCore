import {Application, AppState} from "./application/Application";
import {Protocol} from "./client/Protocol";
import {MainScreenState} from "./client/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./terminalView/TerminalViewFactory";
import {SingleRoundState} from "./client/round/SingleRoundState";
import {SingleResultScreenState} from "./client/resultScreen/SingleResultScreenState";

const viewFactory = new TerminalViewFactory();
const app:Application = new Application(viewFactory);

app.fillSlot(Protocol.StartApplication, new MainScreenState());
app.fillSlot(Protocol.StartRound, new SingleRoundState());
app.fillSlot(Protocol.RoundResult, new SingleResultScreenState());

app.toState(Protocol.StartApplication);

(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
