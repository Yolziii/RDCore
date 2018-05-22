import {IClientApplication} from "../IClientApplication";
import {Application} from "../Application";
import {IViewFactory} from "./IViewFactory";
import {IRemoteApplication} from "../IRemoteApplication";

export class ClientApplication extends Application implements IClientApplication {
    private _viewFactory:IViewFactory;
    private _appServer:IRemoteApplication;

    constructor(eventPrototypes:any, viewFactory:IViewFactory, appServer:IRemoteApplication) {
        super(eventPrototypes);
        this._viewFactory = viewFactory;
        this._appServer = appServer;
    }

    public get viewFactory():IViewFactory {
        return this._viewFactory;
    }
}
