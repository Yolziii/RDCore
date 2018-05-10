import * as assert from "assert";
import "mocha";
import {AppEvent, Application, AppState, IAppEvent} from "../src/application/Application";
import {Protocol} from "../src/application/Protocol";
import {MockViewFactory} from "./mocks/mock.View";

describe("Application", () => {
    class TestFlowState extends AppState {
        public activate(event:IAppEvent=null) {
            this.end();
        }
    }

    class TestStatesFactory { // Фабрика состояний приложения для тестов
        public createAppState(id: Protocol, application: Application):AppState {
            return new AppState(id, application);
        }
        public createFlowState(id: Protocol, application: Application):AppState {
            return new TestFlowState(id, application);
        }
    }

    const factory = new TestStatesFactory();

    let app:Application;
    beforeEach(() => {
        app = new Application(new MockViewFactory());
        app.addStateFactory(Protocol.StartApplication, factory.createAppState);
        app.addStateFactory(Protocol.StartRound, factory.createAppState);
        app.toState(Protocol.StartApplication); // Начальное состояние
    });

    it("Inited state", () => {
        assert.equal(app.activeState.id, Protocol.StartApplication);
    });

    it("AppState knows it app", () => {
        assert.equal(app.activeState.app, app);
    });

    it("Current state ia active", () => {
        const currentState:AppState = app.activeState as AppState;
        assert.equal(currentState.active, true);
    });

    it("Move to another state", () => {
        app.toState(Protocol.StartRound);
        assert.equal(app.activeState.id, Protocol.StartRound);
    });

    it("Unregistered state do nothing", () => {
        app.toState(Protocol.Round);
        assert.equal(app.activeState.id, Protocol.StartApplication);
    });

    it("Move to another state by event", () => {
        const event:IAppEvent = new AppEvent(Protocol.StartRound);
        app.onEvent(event);
        assert.equal(app.activeState.id, Protocol.StartRound);
    });

    it("Last state in parent", () => {
        app.toState(Protocol.StartRound);
        assert.equal(app.activeState.hasParent(Protocol.StartApplication), true);
    });

    it("removeStateAndFactory()", () => {
        app.removeStateAndFactory(Protocol.StartRound);
        app.toState(Protocol.StartRound);
        assert.equal(app.activeState.id, Protocol.StartApplication);
    });
});
