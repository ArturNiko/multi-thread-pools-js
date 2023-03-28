export var WorkerState;
(function (WorkerState) {
    WorkerState["RUNNING"] = "running";
    WorkerState["READY"] = "ready";
    WorkerState["SLEEPING"] = "sleeping";
})(WorkerState || (WorkerState = {}));
export var PoolMode;
(function (PoolMode) {
    PoolMode["KEEP_ALIVE"] = "keep_alive";
    PoolMode["FKARR"] = "fkarr";
    PoolMode["REMOVE"] = "remove";
})(PoolMode || (PoolMode = {}));
export var ThreadsControllerMode;
(function (ThreadsControllerMode) {
    ThreadsControllerMode["REGULAR"] = "regular";
    ThreadsControllerMode["RACE"] = "race";
})(ThreadsControllerMode || (ThreadsControllerMode = {}));
