var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _MultiThreadPoolController_threadPrefix, _MultiThreadPoolController_threadLimit, _MultiThreadPoolController_threadCount, _MultiThreadPoolController_mode;
import { ThreadsControllerMode as Mode } from '../helpers/Types';
import WorkersPool from './WorkersPool';
export default class MultiThreadPoolController {
    constructor() {
        var _a;
        _MultiThreadPoolController_threadPrefix.set(this, 'Thread_');
        _MultiThreadPoolController_threadLimit.set(this, ((_a = navigator.hardwareConcurrency) !== null && _a !== void 0 ? _a : 4) - 1);
        Object.defineProperty(this, "threads", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        _MultiThreadPoolController_threadCount.set(this, 0);
        _MultiThreadPoolController_mode.set(this, Mode.REGULAR);
    }
    initialize(limit = 999) {
        __classPrivateFieldSet(this, _MultiThreadPoolController_threadCount, Math.min(limit, __classPrivateFieldGet(this, _MultiThreadPoolController_threadLimit, "f")), "f");
        for (let i = 0; i < __classPrivateFieldGet(this, _MultiThreadPoolController_threadCount, "f"); i++) {
            const threadIndex = i + 2;
            this.threads.push(new WorkersPool(__classPrivateFieldGet(this, _MultiThreadPoolController_threadPrefix, "f") + threadIndex, this));
        }
    }
    test(info = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (info) {
                console.warn('Existing threads are going to be terminated.');
                console.log('Test stated.');
            }
            this.threads.forEach(thread => {
                //Testing
                thread.terminate();
                const testFunc = function (message) {
                    const start = performance.now();
                    let value = 0;
                    for (let i = 0; i < 1000000000; i++)
                        value += i;
                    postMessage({ exec_time: performance.now() - start, message: message.data });
                };
                thread.add(testFunc);
            });
            return yield this.all('test done!');
        });
    }
    race(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _MultiThreadPoolController_mode, "f") === Mode.RACE)
                return;
            __classPrivateFieldSet(this, _MultiThreadPoolController_mode, Mode.RACE, "f");
            const promises = [];
            this.threads.forEach(thread => promises.push(thread.run(message)));
            return yield Promise.race(promises).then((value) => {
                this.restart();
                __classPrivateFieldSet(this, _MultiThreadPoolController_mode, Mode.REGULAR, "f");
                return value;
            });
        });
    }
    all(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            this.threads.forEach(thread => promises.push(thread.run(message)));
            return yield Promise.all(promises);
        });
    }
    restart() {
        this.threads.forEach(thread => {
            thread.restart();
        });
    }
    get limit() {
        return __classPrivateFieldGet(this, _MultiThreadPoolController_threadLimit, "f");
    }
    get mode() {
        return __classPrivateFieldGet(this, _MultiThreadPoolController_mode, "f");
    }
    set threadsMode(mode) {
        this.threads.forEach(thread => thread.mode = mode);
    }
}
_MultiThreadPoolController_threadPrefix = new WeakMap(), _MultiThreadPoolController_threadLimit = new WeakMap(), _MultiThreadPoolController_threadCount = new WeakMap(), _MultiThreadPoolController_mode = new WeakMap();
