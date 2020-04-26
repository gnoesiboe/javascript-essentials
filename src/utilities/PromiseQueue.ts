export type ExecuteCallback<R> = () => Promise<R>;

type QueueItem = {
    executeCallback: ExecuteCallback<any>;
    resolve: Function;
    reject: Function;
};

export default class PromiseQueue {
    _queue: QueueItem[] = [];
    _isStarted = false;

    public add<T>(executeCallback: ExecuteCallback<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this._queue.push({
                executeCallback: executeCallback,
                resolve,
                reject,
            });

            if (this._isStarted) {
                return;
            }

            this._isStarted = true;

            this.start();
        });
    }

    get length() {
        return this._queue.length;
    }

    get started() {
        return this._isStarted;
    }

    private start() {
        const noOfItemsInQueue: number = this._queue.length;

        if (noOfItemsInQueue === 0) {
            this._isStarted = false;

            return;
        }

        const firstQueueItem = this._queue.shift();

        if (!firstQueueItem) {
            throw new Error('Expecting there to be a queue item at this point');
        }

        firstQueueItem
            .executeCallback()
            .then((...args) => firstQueueItem.resolve(...args))
            .catch((error) => firstQueueItem.reject(error))
            .finally(() => {
                this.start();
            });
    }
}
