import {Application, AppState} from "../application/Application";
import {Protocol} from "../client/Protocol";
import {MainScreenState} from "../client/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./TerminalViewFactory";
import {SingleRoundState} from "../client/round/SingleRoundState";

const viewFactory = new TerminalViewFactory();
const app:Application = new Application(viewFactory);

app.fillSlot(Protocol.StartApplication, new MainScreenState());
app.fillSlot(Protocol.StartRound, new SingleRoundState());

app.toState(Protocol.StartApplication);

(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
