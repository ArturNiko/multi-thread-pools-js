import WorkerWrapper from "./WorkerWrapper"
import {ThreadsInterface} from "../helpers/Interfaces"

export type Mode = Modes.REGULAR | Modes.RACE
export enum Modes {
    REGULAR = 'regular',
    RACE = 'race',
}

export default class ThreadsController implements ThreadsInterface {
    readonly #threadPrefix: string = 'Thread_'
    readonly #threadLimit: number = (navigator.hardwareConcurrency ?? 4) / 2 - 1
    #threadCount: number = 0
    #mode: Mode

    public constructor() {
        this.#mode = Modes.REGULAR
    }

    public initialize(limit: number = 999) {
        this.#threadCount = Math.min(limit, this.#threadLimit)
        for (let i = 0; i < this.#threadCount; i++) {
            const threadIndex = i + 2
            if (!(this.#threadPrefix + threadIndex.toString() in this)) {
                const obj: { [key: string]: any } = {}
                obj[this.#threadPrefix + threadIndex.toString()] = new WorkerWrapper(this.#threadPrefix + threadIndex, this)
                Object.assign(this, obj)
            }
        }
    }

    public async test(info: boolean = true) {
        if (info) {
            console.warn('Existing threads are going to be terminated.')
            console.log('Test stated.')
        }

        Object.values(this).forEach(thread => {
            //Testing
            thread.terminate()
            const testFunc = function (message: any) {
                const start = performance.now()
                let value = 0
                for (let i = 0; i < 1000000000; i++) value += i
                postMessage({exec_time: performance.now() - start, message: message.data})
            }

            thread.create(testFunc)
        })

        return await this.all('test done!')
    }

    public async race(message: any): Promise<any> {
        if (this.#mode === Modes.RACE) return
        this.#mode = Modes.RACE

        const promises: Array<Promise<any>> = []
        Object.values(this).forEach(thread => {
            if (thread.isReady) promises.push(thread.run(message))
        })

        return await Promise.race(promises).then((value) => {
            this.restart()
            this.#mode = Modes.REGULAR
            return value
        })
    }

    public async all(message: any) {
        const promises: Array<Promise<any>> = []

        Object.values(this).forEach(thread => {
            if (thread.isReady) promises.push(thread.run(message))
        })

        return await Promise.all(promises)
    }

    public restart() {
        Object.values(this).forEach(thread => {
            thread.restart()
        })
    }

    public get limit() {
        return this.#threadLimit
    }

    public get mode() {
        return this.#mode
    }
}