import * as assert from "assert";
import "mocha";
import {AppEvent, Application, AppState, IAppEvent, IAppState} from "../src/application/Application";
import {Protocol} from "../src/client/Protocol";
import {MockViewFactory} from "./mocks/mock.View";

describe("Application", () => {
    let stateApp: IAppState;
    let stateRound: IAppState;

    let app:Application;
    beforeEach(() => {

        app = new Application(new MockViewFactory());

        stateApp = new AppState();
        app.fillSlot(Protocol.StartApplication, stateApp);
        stateRound = new AppState();
        app.fillSlot(Protocol.StartRound, stateRound);

        app.toState(Protocol.StartApplication); // Начальное состояние
    });

    it("Inited state", () => {
        assert.equal(app.activeState.slot, Protocol.StartApplication);
    });

    it("AppState knows it app", () => {
        assert.equal(app.activeState.app, app);
    });

    it("Move to another state", () => {
        app.toState(Protocol.StartRound);
        assert.equal(app.activeState.slot, Protocol.StartRound);
    });

    it("Unregistered state do nothing", () => {
        app.toState(Protocol.Round);
        assert.equal(app.activeState.slot, Protocol.StartApplication);
    });

    it("Move to another state by event", () => {
        const event:IAppEvent = new AppEvent(Protocol.StartRound);
        app.onEvent(event);
        assert.equal(app.activeState.slot, Protocol.StartRound);
    });

    /*it("Last state in parent", () => {
        app.toState(Protocol.StartRound);
        assert.equal(app.activeState.hasParent(Protocol.StartApplication), true);
    });*/

    it("clearSlot()", () => {
        app.clearSlot(Protocol.StartRound);
        app.toState(Protocol.StartRound);
        assert.equal(app.activeState.slot, Protocol.StartApplication);
    });
});
