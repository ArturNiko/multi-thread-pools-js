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
var _WorkerWrapper_worker, _WorkerWrapper_method, _WorkerWrapper_methodBytes, _WorkerWrapper_blob, _WorkerWrapper_url, _WorkerWrapper_state, _WorkerWrapper_response, _WorkerWrapper_responseResolve, _WorkerWrapper_controller, _WorkerWrapper_name;
var States;
(function (States) {
    States["RUNNING"] = "running";
    States["READY"] = "ready";
    States["SLEEPING"] = "sleeping";
})(States || (States = {}));
export default class WorkerWrapper {
    constructor(name, controller) {
        _WorkerWrapper_worker.set(this, void 0);
        Object.defineProperty(this, "_callback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (message) => __awaiter(this, void 0, void 0, function* () {
                __classPrivateFieldSet(this, _WorkerWrapper_response, message.data, "f");
                __classPrivateFieldSet(this, _WorkerWrapper_state, States.READY, "f");
                __classPrivateFieldGet(this, _WorkerWrapper_responseResolve, "f").call(this);
            })
        });
        _WorkerWrapper_method.set(this, null);
        _WorkerWrapper_methodBytes.set(this, null);
        _WorkerWrapper_blob.set(this, null);
        _WorkerWrapper_url.set(this, null);
        _WorkerWrapper_state.set(this, void 0);
        _WorkerWrapper_response.set(this, null);
        _WorkerWrapper_responseResolve.set(this, function () { });
        _WorkerWrapper_controller.set(this, void 0);
        _WorkerWrapper_name.set(this, void 0);
        __classPrivateFieldSet(this, _WorkerWrapper_name, name, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_controller, controller, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_state, States.SLEEPING, "f");
    }
    create(method = null) {
        if (!this.isSleeping || (typeof method !== 'function' && __classPrivateFieldGet(this, _WorkerWrapper_method, "f") === null))
            return;
        __classPrivateFieldSet(this, _WorkerWrapper_method, method || __classPrivateFieldGet(this, _WorkerWrapper_method, "f"), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_methodBytes, new TextEncoder().encode(`onmessage = ${__classPrivateFieldGet(this, _WorkerWrapper_method, "f")}`), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_blob, new Blob([__classPrivateFieldGet(this, _WorkerWrapper_methodBytes, "f")], { type: 'text/javascript' }), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_url, URL.createObjectURL(__classPrivateFieldGet(this, _WorkerWrapper_blob, "f")), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_worker, new Worker(__classPrivateFieldGet(this, _WorkerWrapper_url, "f")), "f");
        __classPrivateFieldGet(this, _WorkerWrapper_worker, "f").onmessage = this._callback;
        __classPrivateFieldSet(this, _WorkerWrapper_state, States.READY, "f");
    }
    run(message = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady || !(__classPrivateFieldGet(this, _WorkerWrapper_worker, "f") instanceof Worker))
                return;
            __classPrivateFieldGet(this, _WorkerWrapper_worker, "f").postMessage(message);
            __classPrivateFieldSet(this, _WorkerWrapper_state, States.RUNNING, "f");
            return new Promise(resolve => {
                __classPrivateFieldSet(this, _WorkerWrapper_responseResolve, () => resolve(__classPrivateFieldGet(this, _WorkerWrapper_response, "f")), "f");
            });
        });
    }
    restart() {
        this.softTerminate();
        this.create();
    }
    softTerminate() {
        if (this.isSleeping || !(__classPrivateFieldGet(this, _WorkerWrapper_worker, "f") instanceof Worker))
            return;
        __classPrivateFieldGet(this, _WorkerWrapper_worker, "f").terminate();
        __classPrivateFieldSet(this, _WorkerWrapper_worker, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_state, States.SLEEPING, "f");
    }
    terminate() {
        if (this.isSleeping || !(__classPrivateFieldGet(this, _WorkerWrapper_worker, "f") instanceof Worker))
            return;
        __classPrivateFieldSet(this, _WorkerWrapper_method, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_methodBytes, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_blob, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_url, null, "f");
        __classPrivateFieldGet(this, _WorkerWrapper_worker, "f").terminate();
        __classPrivateFieldSet(this, _WorkerWrapper_worker, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_state, States.SLEEPING, "f");
    }
    destroy() {
        this.terminate();
        delete __classPrivateFieldGet(this, _WorkerWrapper_controller, "f")[this.name];
        //delete this
    }
    get state() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f"); }
    get method() { return __classPrivateFieldGet(this, _WorkerWrapper_method, "f"); }
    get bytes() { return __classPrivateFieldGet(this, _WorkerWrapper_methodBytes, "f"); }
    get url() { return __classPrivateFieldGet(this, _WorkerWrapper_url, "f"); }
    get callback() { return this._callback; }
    get name() { return __classPrivateFieldGet(this, _WorkerWrapper_name, "f"); }
    get isSleeping() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f") === States.SLEEPING; }
    get isRunning() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f") === States.RUNNING; }
    get isReady() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f") === States.READY; }
}
_WorkerWrapper_worker = new WeakMap(), _WorkerWrapper_method = new WeakMap(), _WorkerWrapper_methodBytes = new WeakMap(), _WorkerWrapper_blob = new WeakMap(), _WorkerWrapper_url = new WeakMap(), _WorkerWrapper_state = new WeakMap(), _WorkerWrapper_response = new WeakMap(), _WorkerWrapper_responseResolve = new WeakMap(), _WorkerWrapper_controller = new WeakMap(), _WorkerWrapper_name = new WeakMap();
