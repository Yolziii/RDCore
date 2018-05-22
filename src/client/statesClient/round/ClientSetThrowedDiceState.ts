import {AppState} from "../../../app/AppState";
import {IDeserializer} from "../../../app/IDeserializer";
import {Slot} from "../../../app/Slot";
import {AppEventSetThrowedDice} from "../../../events/round/AppEventSetThrowedDice";
import {Dice} from "../../../model/coreGameplay/dice/Dice";
import {IRound} from "../../../model/coreGameplay/round/IRound";

/** Передает модели брошенные сервером кости */
export class ClientSetThrowedDiceState extends AppState implements IDeserializer {
    private model:IRound;

    constructor() {
        super(Slot.RoundSetThrowedDice);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:AppEventSetThrowedDice) {
        this.app.exitToPreviousState();
        this.model.setThrowedDice(event.dice);
    }

    public fromJSON(json: any): AppEventSetThrowedDice {
        const event = Object.create(AppEventSetThrowedDice.prototype);
        json.dice = Dice.fromJSON(json.dice);
        return Object.assign(event, json);
    }
}
