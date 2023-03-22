var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ThreadsController_threadPrefix, _ThreadsController_threadLimit, _ThreadsController_threadCount, _ThreadsController_mode;
import WorkerWrapper from "./WorkerWrapper";
var Modes;
(function (Modes) {
    Modes["REGULAR"] = "regular";
    Modes["RACE"] = "race";
})(Modes || (Modes = {}));
export default class ThreadsController {
    constructor() {
        var _a;
        _ThreadsController_threadPrefix.set(this, 'Thread_');
        _ThreadsController_threadLimit.set(this, ((_a = navigator.hardwareConcurrency) !== null && _a !== void 0 ? _a : 4) / 2 - 1);
        _ThreadsController_threadCount.set(this, 0);
        _ThreadsController_mode.set(this, void 0);
        __classPrivateFieldSet(this, _ThreadsController_mode, Modes.REGULAR, "f");
    }
    initialize(limit = 999) {
        __classPrivateFieldSet(this, _ThreadsController_threadCount, Math.min(limit, __classPrivateFieldGet(this, _ThreadsController_threadLimit, "f")), "f");
        for (let i = 0; i < __classPrivateFieldGet(this, _ThreadsController_threadCount, "f"); i++) {
            const threadIndex = i + 2;
            if (!(__classPrivateFieldGet(this, _ThreadsController_threadPrefix, "f") + threadIndex.toString() in this)) {
                const obj = {};
                obj[__classPrivateFieldGet(this, _ThreadsController_threadPrefix, "f") + threadIndex.toString()] = new WorkerWrapper(__classPrivateFieldGet(this, _ThreadsController_threadPrefix, "f") + threadIndex, this);
                Object.assign(this, obj);
            }
        }
    }
    test(info = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (info) {
                console.warn('Existing threads are going to be terminated.');
                console.log('Test stated.');
            }
            Object.values(this).forEach(thread => {
                //Testing
                thread.terminate();
                const testFunc = function (message) {
                    const start = performance.now();
                    let value = 0;
                    for (let i = 0; i < 1000000000; i++)
                        value += i;
                    postMessage({ exec_time: performance.now() - start, message: message.data });
                };
                thread.create(testFunc);
            });
            return yield this.all('test done!');
        });
    }
    race(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _ThreadsController_mode, "f") === Modes.RACE)
                return;
            __classPrivateFieldSet(this, _ThreadsController_mode, Modes.RACE, "f");
            const promises = [];
            Object.values(this).forEach(thread => {
                if (thread.isReady)
                    promises.push(thread.run(message));
            });
            return yield Promise.race(promises).then((value) => {
                this.restart();
                __classPrivateFieldSet(this, _ThreadsController_mode, Modes.REGULAR, "f");
                return value;
            });
        });
    }
    all(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            Object.values(this).forEach(thread => {
                if (thread.isReady)
                    promises.push(thread.run(message));
            });
            return yield Promise.all(promises);
        });
    }
    restart() {
        Object.values(this).forEach(thread => {
            thread.restart();
        });
    }
    get limit() {
        return __classPrivateFieldGet(this, _ThreadsController_threadLimit, "f");
    }
    get mode() {
        return __classPrivateFieldGet(this, _ThreadsController_mode, "f");
    }
}
_ThreadsController_threadPrefix = new WeakMap(), _ThreadsController_threadLimit = new WeakMap(), _ThreadsController_threadCount = new WeakMap(), _ThreadsController_mode = new WeakMap();
