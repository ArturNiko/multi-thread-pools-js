import {Nullable, PoolMode, RunMode as Mode} from '../types/Types'
import {MultithreadingInterface} from '../types/Interfaces'

import WorkersPool from './WorkersPool'

export default class MultithreadingController implements MultithreadingInterface {
    readonly #threadPrefix: string = 'Thread_'
    readonly #threadLimit: number = (window.navigator.hardwareConcurrency ?? 4) - 1

    #threads: WorkersPool[] = []
    #threadCount: number = 0
    #mode: Mode = Mode.REGULAR

    public constructor() {}

    public initialize(limit: number = 999) {
        this.#threadCount = Math.min(limit, this.#threadLimit)
        for (let i = 0; i < this.#threadCount; i++) {
            const threadIndex = i + 2
            this.threads.push(new WorkersPool(this.#threadPrefix + threadIndex, this))
        }
    }

    public async test(info: boolean = true) {
        if (info) {
            console.warn('Existing threads are going to be terminated.')
            console.log('Test stated.')
        }

        this.threads.forEach(thread => {
            //Testing
            thread.terminate()
            const testFunc = function (text: any) {
                const start = performance.now()
                let value = 0
                for (let i = 0; i < 1000000000; i++) value += i
                postMessage({
                        exec_time: performance.now() - start,
                        message: text
                })
            }

            thread.add(testFunc)
        })

        return await this.all({text: 'Done!'})
    }

    public destroy(id: number): void {
        if (this.threads[id] instanceof WorkersPool) {
            this.terminate(id)
            this.#threads.splice(id, 1)
        }
    }

    public destroyAll(): void {
        for (let i = 0; this.threads.length > i; i++) this.destroy(i)
        this.#threads = []
    }

    public async race(message: any, scope?: NonNullable<Object>): Promise<any> {
        if (this.#mode === Mode.RACE) return
        this.#mode = Mode.RACE

        const promises: Array<Promise<any>> = []
        this.threads.forEach(thread => promises.push(thread.run(message, scope)))

        return await Promise.race(promises).then((value) => {
            this.restart()
            this.#mode = Mode.REGULAR
            return value
        })
    }

    public async all(message: any, scope?: NonNullable<Object>): Promise<Array<any>> {
        const promises: Array<Promise<any>> = []

        this.threads.forEach(thread => promises.push(thread.run(message, scope)))

        return await Promise.all(promises)
    }

    public async run(id: number, message: any, scope?: NonNullable<Object>): Promise<any> {
        return this.threads[id] instanceof WorkersPool
            ? await this.threads[id].run(message, scope)
            : message
    }

    public add(id: number, ...methods: Function[]): Nullable<WorkersPool> {
        return this.threads[id] instanceof WorkersPool
            ? this.threads[id].add(...methods)
            : null
    }

    public restart(id?: number) {
        if (id) {
            if (this.threads[id] instanceof WorkersPool) this.threads[id].restart()
        } else this.threads.forEach(thread => thread.restart())
    }

    public softTerminate(id?: number): void {
        if (id) {
            if (this.threads[id] instanceof WorkersPool) this.threads[id].softTerminate()
        } else this.threads.forEach(thread => thread.softTerminate())
    }

    public terminate(id?: number): void {
        if (id) {
            if (this.threads[id] instanceof WorkersPool) this.threads[id].terminate()
        } else this.threads.forEach(thread => thread.terminate())
    }

    public clear(id?: number): void {
        if (id) {
            if (this.threads[id] instanceof WorkersPool) this.threads[id].clear()
        } else this.threads.forEach(thread => thread.clear())
    }

    public remove(id: number, ...pos: number[]): void {
        if (this.threads[id] instanceof WorkersPool) this.threads[id].remove(...pos)
    }

    public get limit(): number {
        return this.#threadLimit
    }

    public get runMode(): Mode {
        return this.#mode
    }

    public get threads(): WorkersPool[] {
        return this.#threads
    }

    public set poolMode(mode: PoolMode) {
        this.threads.forEach(thread => thread.mode = mode)
    }
}