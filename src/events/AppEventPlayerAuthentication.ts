import {AppEvent} from "../app/AppEvent";
import {IPlayer} from "../app/IPlayer";
import {Slot} from "../app/Slot";

export class AppEventPlayerAuthentication extends AppEvent {
    public player:IPlayer;

    constructor(player:IPlayer) {
        super(Slot.PlayerAuthentication);
        this.player = player;
    }
}
