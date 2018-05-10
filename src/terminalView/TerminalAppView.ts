export interface IKeyListener {
    onKey(key:string);
}

export class TerminalAppView {
    private static _instance:TerminalAppView = null;

    public static get instance():TerminalAppView {
        if (TerminalAppView._instance === null) {
            TerminalAppView._instance = new TerminalAppView();
        }
        return TerminalAppView._instance;
    }

    private keyObservers:IKeyListener[] = [];

    private constructor() {
        // without this, we would only getFrom streams once enter is pressed
        process.stdin.setRawMode( true );

        // resume stdin in the parent process (node app won"t quit all by itself
        // unless an error or process.deactivate() happens)
        process.stdin.resume();

        // i don"t want binary, do you?
        process.stdin.setEncoding( "utf8" );

        const self = this;

        // on any data into stdin
        process.stdin.on( "data", (key) => {
            // ctrl-c ( end of text )
            if ( key === "\u0003" ) {
                process.exit();
            }

            self.onKey(key);

            // write the key to stdout all normal like
            // process.stdout.write( key );
        });
    }

    public addObserver(listener:IKeyListener) {
        this.keyObservers.push(listener);
    }

    public removeObserver(listener:IKeyListener) {
        const i = this.keyObservers.indexOf(listener);
        if (i !== -1) {
            this.keyObservers.splice(i, 1);
        }
    }

    private onKey(key:string) {
        for (const listener of this.keyObservers) {
            listener.onKey(key);
        }
    }
}
