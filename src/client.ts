import {Application, ClientApplication} from "./application/Application";
import {Protocol} from "./client/Protocol";
import {MainScreenState} from "./client/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./client/terminalView/TerminalViewFactory";
import {SingleRoundState} from "./client/round/SingleRoundState";
import {SingleResultScreenState} from "./client/resultScreen/SingleResultScreenState";
import {StartRoundState} from "./client/round/StartRoundState";

const viewFactory = new TerminalViewFactory();
const app:ClientApplication = new ClientApplication(viewFactory);

app.fillSlot(Protocol.StartApplication, new MainScreenState());
app.fillSlot(Protocol.StartRound, new StartRoundState());

app.toState(Protocol.StartApplication);

(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
