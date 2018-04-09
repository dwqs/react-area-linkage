export default class Emitter {
    constructor () {
        this.eventsMap = Object.create(null);
    }

    on (eventName, cb) {
        if (typeof cb !== 'function') {
            return;
        }
        const callbacks = this.eventsMap[eventName] || [];
        callbacks.push(cb);
        this.eventsMap[eventName] = callbacks;
    }

    emit (eventName, ...args) {
        const callbacks = this.eventsMap[eventName];
        callbacks && callbacks.forEach(cb => {
            cb(...args);
        });
    }

    off (eventName, cb) {
        if (!cb) {
            delete this.eventsMap[eventName];
        } else if (typeof cb === 'function' && this.eventsMap[eventName]) {
            const callbacks = this.eventsMap[eventName];
            const index = callbacks.findIndex(callback => callback === cb);
            if (index > -1) {
                callbacks.splice(index, 1);
                this.eventsMap[eventName] = callbacks;
            }
        }
    }

    destroyed () {
        this.eventsMap = null;
    }
}
