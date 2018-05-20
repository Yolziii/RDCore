import {ClientApplication} from "./app/Application";
import {Protocol} from "./app/Protocol";
import {MainScreenState} from "./app/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./client/terminalView/TerminalViewFactory";
import {StartRoundState} from "./app/round/StartRoundState";
import {ClientTransport} from "./client/ClientTransport";
import {ClientEventPrototypes} from "./client/ClientEventPrototypes";
import {ConsoleLogger, FileLogger, Logger, LogLevel} from "./util/Logger";

// To read this file use this in PowerShell:
// Get-Content client.log -Wait -Tail 30
const fileLogger = new FileLogger("./client.log");
fileLogger.setLevel(LogLevel.Error & LogLevel.Warning);
Logger.add(fileLogger);

const remoteServer = new ClientTransport("http://127.0.0.1");
remoteServer.connect();

const viewFactory = new TerminalViewFactory();
const app:ClientApplication = new ClientApplication(ClientEventPrototypes, viewFactory, remoteServer);

remoteServer.linkApplication(app);

app.fillSlot(new MainScreenState());
app.fillSlot(new StartRoundState(remoteServer));

app.toState(Protocol.StartApplication);

(function wait() {
    if (true) {
        setTimeout(wait, 1000);
    }
})();
