// @flow

export type CallbackFunction = (next: CallbackFunction | null) => void;

export default class RestartableTimeout {
    private _callback: CallbackFunction | null;
    private _delay: number;
    private _currentTimeoutId: number | null;
    private _hasStarted: boolean;

    /**
     * @param {number} delay   Delay in milli seconds
     */
    constructor(delay: number) {
        this._callback = null;
        this._delay = delay;
        this._currentTimeoutId = null;
        this._hasStarted = false;

        this.stopAndReset();
    }

    public start(): boolean {
        if (this._hasStarted) {
            throw new Error('Timeout is already running');
        }

        if (!this._callback) {
            throw new Error('Expecting a callback to be set at this point.');
        }

        this._currentTimeoutId = setTimeout(this._callback, this._delay);
        this._hasStarted = true;

        return true;
    }

    public get hasStarted(): boolean {
        return this._hasStarted;
    }

    /**
     * Adds a callback to the timeout. Multiple callbacks can be changed, with the
     * possibility to stop the bubbling by not calling the next in the chain.
     *
     * @param {CallbackFunction} callback
     * @param {Object} context
     */
    public addCallback(callback: CallbackFunction): void {
        // wrap previous callback to be able to create a stopable chain
        this._callback = callback.bind(null, this._callback);
    }

    /**
     * Forces to emit the callback now, instead of delayed through the timeout
     */
    public forceEmitCallback(): void {
        if (!this._callback) {
            throw new Error('Expecting callback to be set at this point');
        }

        this._callback(null);
    }

    public restart(): void {
        if (this._hasStarted && this._currentTimeoutId) {
            clearTimeout(this._currentTimeoutId);
            this._hasStarted = false;
        }

        this.start();
    }

    /**
     * Resets the timeout and clears the callback
     */
    public stopAndReset(): void {
        this._callback = () => this.stopAndReset();

        if (this._hasStarted && this._currentTimeoutId) {
            clearTimeout(this._currentTimeoutId);
        }

        this._hasStarted = false;
    }
}
