import {ClientApplication} from "./app/Application";
import {Protocol} from "./app/Protocol";
import {MainScreenState} from "./app/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./client/terminalView/TerminalViewFactory";
import {StartRoundState} from "./app/round/StartRoundState";

const viewFactory = new TerminalViewFactory();
const app:ClientApplication = new ClientApplication(viewFactory);

app.fillSlot(new MainScreenState());
app.fillSlot(new StartRoundState());

app.toState(Protocol.StartApplication);

(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
