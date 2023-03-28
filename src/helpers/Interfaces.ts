import {Nullable} from './Types'
import WorkersPool from '../controllers/WorkersPool'

export interface WorkerWrapperInterface {
    initialize: (...method: Nullable<Function>[]) => void,
    run: (message: any) => Promise<any>,
    restart: () => void,
    terminate: () => void,
    softTerminate: () => void,
}


export interface WorkersPoolInterface extends Omit<WorkerWrapperInterface, 'initialize'>{
    add: (...methods: Function[]) => void,
    clear: () => void,
}
export interface ThreadsInterface {
    threads: WorkersPool[],
    initialize: () => void,
    test: (info: boolean) => void,
    race: (message: any) => Promise<any>,
    all: (message: any) => Promise<any>,
}