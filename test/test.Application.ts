import * as assert from "assert";
import "mocha";
import {AppEvent, Application, AppState, IAppEvent, IAppState} from "../src/application/Application";
import {Protocol} from "../src/client/Protocol";
import {MockViewFactory} from "./mocks/mock.View";

describe("Application", () => {
    enum TestProtocol {
        Start,
        Main,
        StartRound,
        Round,
        RoundResult,
        SomeUnregistered
    }

    class TestState extends AppState {
        public isSleep = false;
        public isActive = false;
        public isInited = false;

        public sleep() {
            this.isSleep = true;
        }

        public wakeup() {
            this.isSleep = false;
        }

        public activate(event:IAppEvent = null) {
            this.isActive = true;
        }

        public exit() {
            this.isActive = false;
        }

        public init() {
            this.isInited = true;
        }
    }

    class TestStartRoundState extends TestState {
        public activate(event:IAppEvent = null) {
            this.app.exitToState(TestProtocol.Round);
        }
    }

    let stateStart: TestState;
    let stateMain: TestState;
    let stateStartRound: TestState;
    let stateRound:TestState;
    let stateRoundResult:TestState;

    let app:Application;
    beforeEach(() => {

        app = new Application(new MockViewFactory());

        stateStart = new TestState();
        app.fillSlot(TestProtocol.Start, stateStart);

        stateMain = new TestState();
        app.fillSlot(TestProtocol.Main, stateMain);

        stateStartRound = new TestStartRoundState();
        app.fillSlot(TestProtocol.StartRound, stateStartRound);

        stateRound = new TestState();
        app.fillSlot(TestProtocol.Round, stateRound);

        stateRoundResult = new TestState();

        app.toState(TestProtocol.Start); // Начальное состояние
    });

    it("State inits while fills slot", () => {
        assert.equal(stateMain.isInited, true);
        assert.equal(stateRoundResult.isInited, false);
    });

    it("AppState knows it app", () => {
        assert.equal(app.currentState.app, app);
    });

    it("Current state", () => {
        assert.equal(app.currentState, stateStart);
        assert.equal(stateStart.isInited, true);
        assert.equal(stateStart.isActive, true);
        assert.equal(stateStart.isSleep, false);
    });

    it("Move to another state", () => {
        app.toState(TestProtocol.Main);
        assert.equal(app.currentState, stateMain);

        assert.equal(stateStart.isSleep, true);
        assert.equal(stateStart.isActive, true);
    });

    it("Back to state", () => {
        app.toState(TestProtocol.Main);
        app.toState(TestProtocol.Start);
        assert.equal(app.currentState, stateStart);

        assert.equal(stateMain.isActive, false);
        assert.equal(stateMain.isSleep, true);
    });

    it("Move to another state by event", () => {
        const event:IAppEvent = new AppEvent(TestProtocol.Main);
        app.onEvent(event);
        assert.equal(app.currentState.slot, TestProtocol.Main);
    });

    it("Move to flow state", () => {
        app.toState(TestProtocol.StartRound);
        assert.equal(app.currentState, stateRound);
    });

    it("Move to flow state by event", () => {
        const event:IAppEvent = new AppEvent(TestProtocol.StartRound);
        app.onEvent(event);
        assert.equal(app.currentState, stateRound);
    });

    it("Unregistered state do nothing", () => {
        app.toState(TestProtocol.SomeUnregistered);
        assert.equal(app.currentState, stateStart);
    });

    /*it("Last state in parent", () => {
        app.toState(TestProtocol.StartRound);
        assert.equal(app.currentState.hasParent(TestProtocol.StartApplication), true);
    });*/

    it("clearSlot()", () => {
        app.clearSlot(TestProtocol.StartRound);
        app.toState(TestProtocol.StartRound);
        assert.equal(app.currentState, stateStart);
    });
});
