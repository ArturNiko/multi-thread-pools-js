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
var _WorkerWrapper_callback, _WorkerWrapper_worker, _WorkerWrapper_method, _WorkerWrapper_methodBytes, _WorkerWrapper_blob, _WorkerWrapper_url, _WorkerWrapper_state, _WorkerWrapper_response, _WorkerWrapper_responseResolve;
import { WorkerState as State } from '../helpers/Types';
export default class WorkerWrapper {
    constructor() {
        _WorkerWrapper_callback.set(this, (message) => __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _WorkerWrapper_response, message.data, "f");
            __classPrivateFieldSet(this, _WorkerWrapper_state, State.READY, "f");
            __classPrivateFieldGet(this, _WorkerWrapper_responseResolve, "f").call(this);
        }));
        _WorkerWrapper_worker.set(this, void 0);
        _WorkerWrapper_method.set(this, null);
        _WorkerWrapper_methodBytes.set(this, null);
        _WorkerWrapper_blob.set(this, null);
        _WorkerWrapper_url.set(this, null);
        _WorkerWrapper_state.set(this, State.SLEEPING);
        _WorkerWrapper_response.set(this, null);
        _WorkerWrapper_responseResolve.set(this, function () { });
    }
    initialize(method = null) {
        if (!this.isSleeping || (typeof method !== 'function' && __classPrivateFieldGet(this, _WorkerWrapper_method, "f") === null))
            return;
        __classPrivateFieldSet(this, _WorkerWrapper_method, method || __classPrivateFieldGet(this, _WorkerWrapper_method, "f"), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_methodBytes, new TextEncoder().encode(`onmessage = ${__classPrivateFieldGet(this, _WorkerWrapper_method, "f")}`), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_blob, new Blob([__classPrivateFieldGet(this, _WorkerWrapper_methodBytes, "f")], { type: 'text/javascript' }), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_url, URL.createObjectURL(__classPrivateFieldGet(this, _WorkerWrapper_blob, "f")), "f");
        __classPrivateFieldSet(this, _WorkerWrapper_worker, new Worker(__classPrivateFieldGet(this, _WorkerWrapper_url, "f")), "f");
        __classPrivateFieldGet(this, _WorkerWrapper_worker, "f").onmessage = __classPrivateFieldGet(this, _WorkerWrapper_callback, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_state, State.READY, "f");
    }
    run(message = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady || !(__classPrivateFieldGet(this, _WorkerWrapper_worker, "f") instanceof Worker))
                return;
            __classPrivateFieldGet(this, _WorkerWrapper_worker, "f").postMessage(message);
            __classPrivateFieldSet(this, _WorkerWrapper_state, State.RUNNING, "f");
            return new Promise(resolve => {
                __classPrivateFieldSet(this, _WorkerWrapper_responseResolve, () => resolve(__classPrivateFieldGet(this, _WorkerWrapper_response, "f")), "f");
            });
        });
    }
    softTerminate() {
        if (this.isSleeping || !(__classPrivateFieldGet(this, _WorkerWrapper_worker, "f") instanceof Worker))
            return;
        __classPrivateFieldGet(this, _WorkerWrapper_worker, "f").terminate();
        __classPrivateFieldSet(this, _WorkerWrapper_worker, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_state, State.SLEEPING, "f");
    }
    terminate() {
        if (this.isSleeping || !(__classPrivateFieldGet(this, _WorkerWrapper_worker, "f") instanceof Worker))
            return;
        this.softTerminate();
        __classPrivateFieldSet(this, _WorkerWrapper_method, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_methodBytes, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_blob, null, "f");
        __classPrivateFieldSet(this, _WorkerWrapper_url, null, "f");
    }
    restart() {
        this.softTerminate();
        this.initialize();
    }
    get state() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f"); }
    get method() { return __classPrivateFieldGet(this, _WorkerWrapper_method, "f"); }
    get bytes() { return __classPrivateFieldGet(this, _WorkerWrapper_methodBytes, "f"); }
    get url() { return __classPrivateFieldGet(this, _WorkerWrapper_url, "f"); }
    get isSleeping() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f") === State.SLEEPING; }
    get isRunning() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f") === State.RUNNING; }
    get isReady() { return __classPrivateFieldGet(this, _WorkerWrapper_state, "f") === State.READY; }
}
_WorkerWrapper_callback = new WeakMap(), _WorkerWrapper_worker = new WeakMap(), _WorkerWrapper_method = new WeakMap(), _WorkerWrapper_methodBytes = new WeakMap(), _WorkerWrapper_blob = new WeakMap(), _WorkerWrapper_url = new WeakMap(), _WorkerWrapper_state = new WeakMap(), _WorkerWrapper_response = new WeakMap(), _WorkerWrapper_responseResolve = new WeakMap();
