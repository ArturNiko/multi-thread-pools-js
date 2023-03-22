import {Nullable} from "./Types"
export interface WorkerWrapperInterface {
    create: (method: Nullable<Function>) => void,
    run: (message: any) => Promise<any>,
    restart: () => void,
    terminate: () => void,
    softTerminate: () => void,
    destroy: () => void,
}

export interface ThreadsInterface {
    initialize: () => void,
    test: (info: boolean) => void,
    race: (message: any) => Promise<any>,
    all: (message: any) => Promise<any>,
}