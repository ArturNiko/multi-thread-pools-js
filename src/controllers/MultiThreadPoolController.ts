import {PoolMode, ThreadsControllerMode as Mode} from '../helpers/Types'
import {ThreadsInterface} from '../helpers/Interfaces'

import WorkersPool from './WorkersPool'

export default class MultiThreadPoolController implements ThreadsInterface {
    readonly #threadPrefix: string = 'Thread_'
    readonly #threadLimit: number = (navigator.hardwareConcurrency ?? 4) - 1

    threads: WorkersPool[] = []
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
            const testFunc = function (message: any) {
                const start = performance.now()
                let value = 0
                for (let i = 0; i < 1000000000; i++) value += i
                postMessage({exec_time: performance.now() - start, message: message.data})
            }

            thread.add(testFunc)
        })

        return await this.all('test done!')
    }

    public async race(message: any): Promise<any> {
        if (this.#mode === Mode.RACE) return
        this.#mode = Mode.RACE

        const promises: Array<Promise<any>> = []
        this.threads.forEach(thread => promises.push(thread.run(message)))

        return await Promise.race(promises).then((value) => {
            this.restart()
            this.#mode = Mode.REGULAR
            return value
        })
    }

    public async all(message: any) {
        const promises: Array<Promise<any>> = []

        this.threads.forEach(thread => promises.push(thread.run(message)))

        return await Promise.all(promises)
    }

    public restart() {
        this.threads.forEach(thread => {
            thread.restart()
        })
    }

    public get limit() {
        return this.#threadLimit
    }

    public get mode() {
        return this.#mode
    }

    public set threadsMode(mode: PoolMode) {
        this.threads.forEach(thread => thread.mode = mode)
    }
}