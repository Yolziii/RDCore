import {Application, AppState} from "../application/Application";
import {Protocol} from "../application/Protocol";
import {MainScreenState} from "../application/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./TerminalViewFactory";
import {SingleRoundState} from "../application/round/SingleRoundState";

class ClientStateFactory {
    public createMainScreenState(id: Protocol, application: Application):AppState {
        return new MainScreenState(id, application);
    }
    public createSingleRoundState(id:Protocol, application:Application):AppState {
        return new SingleRoundState(id, application);
    }
}
const factory = new ClientStateFactory();

const viewFactory = new TerminalViewFactory();
const app:Application = new Application(viewFactory);

app.addStateFactory(Protocol.StartApplication, factory.createMainScreenState);
app.addStateFactory(Protocol.StartRound, factory.createSingleRoundState);

app.toState(Protocol.StartApplication);

(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
