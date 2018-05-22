import {IViewFactory} from "./client/IViewFactory";

/**
 * Приложение клиента (у которого есть представление)
 */
export interface IClientApplication {
    /** Фабрика, создающая представления */
    readonly viewFactory:IViewFactory;
}
