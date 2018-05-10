import * as assert from "assert";
import "mocha";
import {Protocol} from "../src/application/Protocol";
import {Application, AppState, IAppEvent} from "../src/application/Application";

describe("AppState", () => {
    const app = new Application();

    beforeEach(() => {
        //
    });

    describe("Parent/child", () => {
        it("Is self", () => {
            const child:AppState = new AppState(Protocol.StartRound, app);
            assert.equal(child.hasParent(Protocol.StartRound), true);
        });

        it("Isn't parent", () => {
            const child:AppState = new AppState(Protocol.StartRound, app);
            assert.equal(child.hasParent(Protocol.StartApplication), false);
        });

        it("Is parent", () => {
            const child:AppState = new AppState(Protocol.StartRound, app);
            const parent:AppState = new AppState(Protocol.StartApplication, app);

            child.linkParent(parent);
            assert.equal(child.hasParent(Protocol.StartApplication), true);
        });

        it("Unlink parent", () => {
            const child:AppState = new AppState(Protocol.StartRound, app);
            const parent:AppState = new AppState(Protocol.StartApplication, app);

            child.linkParent(parent);
            child.unlinkParent();
            assert.equal(child.hasParent(Protocol.StartApplication), false);
        });


    });

    describe("active", () => {
        it("not active by default", () => {
            const state:AppState = new AppState(Protocol.StartApplication, app);
            assert.equal(state.active, false);
        });

        it("active after activate()", () => {
            const state:AppState = new AppState(Protocol.StartApplication, app);
            state.activate();
            assert.equal(state.active, true);
        });

        it("not active after sleep()", () => {
            const state:AppState = new AppState(Protocol.StartApplication, app);
            state.activate();
            state.sleep();
            assert.equal(state.active, false);
        });

        it("active after wakeup()", () => {
            const state:AppState = new AppState(Protocol.StartApplication, app);
            state.activate();
            state.sleep();
            state.wakeup();
            assert.equal(state.active, true);
        });
    });

    describe("Interactions", () => {
        class TestState extends AppState {
            public wasExit:boolean = false;

            protected exit() { // Перегружен exit(), чтобы можно было отследить когда он был вызван
                super.exit();
                this.wasExit = true;
            }
        }

        it("backToParent()", () => {
            const child:TestState = new TestState(Protocol.StartRound, app);
            const parent:AppState = new AppState(Protocol.StartApplication, app);

            child.linkParent(parent);

            child.activate();
            assert.equal(child.active, true);
            assert.equal(child.wasExit, false);
            assert.equal(parent.active, false);

            child.backToParent(Protocol.StartApplication);
            assert.equal(child.active, false); // При возврате к родителю, вызывается exit(), состояние деактивируется
            assert.equal(child.wasExit, true);
        });
    });
});
