import {IResultScreenController} from "./IResultScreenController";

export interface IResultScreenView {
    init(controller:IResultScreenController);
    activate(model);
    sleep();
}
