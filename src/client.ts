import {ClientApplication} from "./app/Application";
import {Protocol} from "./app/Protocol";
import {MainScreenState} from "./app/mainScreen/MainScreenState";
import {TerminalViewFactory} from "./client/terminalView/TerminalViewFactory";
import {StartRoundState} from "./app/round/StartRoundState";
import {ClientTransport} from "./client/ClientTransport";
import {ClientEventPrototypes} from "./client/ClientEventPrototypes";
import {StreamLogger, Logger, LogLevel} from "./util/Logger";

// tslint:disable:no-var-requires
const fs = require("fs");

// tslint:disable: no-bitwise

// To read this file use this in PowerShell:
// Get-Content client.log -Wait -Tail 30

const logStream = fs.createWriteStream("./client.log");
logStream.once("open", (fd) => {/**/});

const fileLogger = new StreamLogger(logStream);
// fileLogger.setLevel(LogLevel.Error | LogLevel.Warning | LogLevel.Info);
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
