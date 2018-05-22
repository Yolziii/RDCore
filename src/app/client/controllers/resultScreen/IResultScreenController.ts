import {IRound} from "../../../../model/coreGameplay/round/IRound";

export interface IResultScreenController {
    activate(model:IRound);
    onClose();
}
