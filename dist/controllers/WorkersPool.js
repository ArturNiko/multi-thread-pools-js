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
var _WorkersPool_pool, _WorkersPool_mode, _WorkersPool_controller, _WorkersPool_name, _WorkersPool_poolMaxSize;
import WorkerWrapper from './WorkerWrapper';
import { PoolMode as Mode } from '../helpers/Types';
export default class WorkersPool {
    constructor(name, controller) {
        _WorkersPool_pool.set(this, []);
        _WorkersPool_mode.set(this, Mode.KEEP_ALIVE);
        _WorkersPool_controller.set(this, void 0);
        _WorkersPool_name.set(this, void 0);
        _WorkersPool_poolMaxSize.set(this, 64);
        __classPrivateFieldSet(this, _WorkersPool_name, name, "f");
        __classPrivateFieldSet(this, _WorkersPool_controller, controller, "f");
    }
    add(...methods) {
        methods.forEach(method => {
            if (__classPrivateFieldGet(this, _WorkersPool_pool, "f").length >= __classPrivateFieldGet(this, _WorkersPool_poolMaxSize, "f"))
                return;
            const workerWrapper = new WorkerWrapper();
            workerWrapper.initialize(method);
            __classPrivateFieldGet(this, _WorkersPool_pool, "f").push(workerWrapper);
        });
    }
    run(message = null) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < __classPrivateFieldGet(this, _WorkersPool_pool, "f").length; i++) {
                message = yield __classPrivateFieldGet(this, _WorkersPool_pool, "f")[i].run(message);
                if (this.isRemoving || (this.isFKARR && i > 0)) {
                    i--;
                    this.remove(i);
                }
            }
            resolve(message);
        }));
    }
    remove(...pos) {
        pos.forEach(i => {
            if (__classPrivateFieldGet(this, _WorkersPool_pool, "f")[i]) {
                __classPrivateFieldGet(this, _WorkersPool_pool, "f")[i].terminate();
                __classPrivateFieldGet(this, _WorkersPool_pool, "f").splice(i, 1);
            }
        });
    }
    pop() {
        if (__classPrivateFieldGet(this, _WorkersPool_pool, "f").length) {
            __classPrivateFieldGet(this, _WorkersPool_pool, "f")[__classPrivateFieldGet(this, _WorkersPool_pool, "f").length - 1].terminate();
            __classPrivateFieldGet(this, _WorkersPool_pool, "f").pop();
        }
    }
    clear() {
        __classPrivateFieldGet(this, _WorkersPool_pool, "f").forEach(wrapper => wrapper.terminate());
        __classPrivateFieldSet(this, _WorkersPool_pool, [], "f");
    }
    softTerminate() {
        __classPrivateFieldGet(this, _WorkersPool_pool, "f").forEach(wrapper => wrapper.softTerminate());
    }
    terminate() {
        __classPrivateFieldGet(this, _WorkersPool_pool, "f").forEach(wrapper => wrapper.terminate());
    }
    restart() {
        __classPrivateFieldGet(this, _WorkersPool_pool, "f").forEach(wrapper => wrapper.restart());
    }
    get isKeepingAlive() { return __classPrivateFieldGet(this, _WorkersPool_mode, "f") === Mode.KEEP_ALIVE; }
    get isFKARR() { return __classPrivateFieldGet(this, _WorkersPool_mode, "f") === Mode.FKARR; }
    get isRemoving() { return __classPrivateFieldGet(this, _WorkersPool_mode, "f") === Mode.REMOVE; }
    get pool() { return __classPrivateFieldGet(this, _WorkersPool_pool, "f"); }
    get name() { return __classPrivateFieldGet(this, _WorkersPool_name, "f"); }
    get mode() { return __classPrivateFieldGet(this, _WorkersPool_mode, "f"); }
    set mode(mode) {
        switch (mode) {
            case 'keep_alive':
                __classPrivateFieldSet(this, _WorkersPool_mode, Mode.KEEP_ALIVE, "f");
                break;
            case 'fkarr':
                __classPrivateFieldSet(this, _WorkersPool_mode, Mode.FKARR, "f");
                break;
            case 'remove':
                __classPrivateFieldSet(this, _WorkersPool_mode, Mode.REMOVE, "f");
                break;
        }
    }
}
_WorkersPool_pool = new WeakMap(), _WorkersPool_mode = new WeakMap(), _WorkersPool_controller = new WeakMap(), _WorkersPool_name = new WeakMap(), _WorkersPool_poolMaxSize = new WeakMap();
