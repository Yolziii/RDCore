import {Application, ClientApplication} from "./app/Application";
import {Protocol} from "./app/Protocol";
import {MainScreenState} from "./app/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./app/terminalView/TerminalViewFactory";
import {SingleRoundState} from "./app/round/SingleRoundState";
import {SingleResultScreenState} from "./app/resultScreen/SingleResultScreenState";
import {StartRoundState} from "./app/round/StartRoundState";

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
