import {Nullable} from './Types'
import WorkersPool from '../controllers/WorkersPool'

export interface MultithreadingInterface{
    threads: WorkersPool[],
    initialize(): void,
    test(info: boolean): void,
    run(id: number, message: object, scope?: NonNullable<Object>): Promise<any>,
    race(message: object, scope?: NonNullable<Object>): Promise<any>,
    all(message: object, scope?: NonNullable<Object>): Promise<Array<any>>,
    add(id: number, ...methods: Function[]): Nullable<WorkersPool>,
    restart(id?: number): void,
    terminate(id?: number): void,
    softTerminate(id?: number): void,
    clear(id?: number): void,
}

export interface WorkersPoolInterface extends Omit<WorkerWrapperInterface, 'initialize'>{
    add(...methods: Function[]): this,
    clear(): void,
}

export interface WorkerWrapperInterface {
    initialize(...method: Nullable<Function>[]): void,
    run(...message: any[]): Promise<any>,
    restart(): void,
    terminate(): void,
    softTerminate(): void,
}

export interface WorkerWrapperHelperInterface {
    prepareString(): string,
    prepareMessage(message: { [key: string]: any }, scope?: NonNullable<Object>): object,
}