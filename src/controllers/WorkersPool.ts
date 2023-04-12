import {PoolMode as Mode} from '../types/Types'
import {WorkersPoolInterface} from '../types/Interfaces'

import WorkerWrapper from './WorkerWrapper'
import MultithreadingController from './MultithreadingController'

export default class WorkersPool implements WorkersPoolInterface {
    #pool: WorkerWrapper[] = []
    #mode: Mode = Mode.KEEP_ALIVE

    readonly #controller: MultithreadingController
    readonly #name: string
    readonly #poolMaxSize: number = 64

    constructor(name: string, controller: MultithreadingController) {
        this.#name = name
        this.#controller = controller
    }

    public add(...methods: Function[]): this {
        methods.forEach(method => {
            if (this.#pool.length >= this.#poolMaxSize) return
            const workerWrapper = new WorkerWrapper()
            workerWrapper.initialize(method)

            this.#pool.push(workerWrapper)
        })
        return this
    }

    public run(message: object, scope?: NonNullable<Object>): Promise<any> {
        return new Promise(async resolve => {
            for (let i = 0; i < this.#pool.length; i++) {
                message = await this.#pool[i].run(message, scope)
                if (this.isRemoving || (this.isFKARR && i > 0)) this.remove(--i)
            }
            resolve(message)
        })
    }

    public remove(...pos: number[]): void {
        pos.forEach(i => {
            if (this.#pool[i]) {
                this.#pool[i].terminate()
                this.#pool.splice(i, 1)
            }
        })
    }

    public pop(): void {
        if (this.#pool.length) {
            this.#pool[this.#pool.length - 1].terminate()
            this.#pool.pop()
        }
    }

    public clear(): void {
        this.#pool.forEach(wrapper => wrapper.terminate())
        this.#pool = []
    }

    public softTerminate(): void {
        this.#pool.forEach(wrapper => wrapper.softTerminate())
    }

    public terminate(): void {
        this.#pool.forEach(wrapper => wrapper.terminate())
    }

    public restart(): void {
        this.#pool.forEach(wrapper => wrapper.restart())
    }

    get isKeepingAlive() {
        return this.#mode === Mode.KEEP_ALIVE
    }

    get isFKARR() {
        return this.#mode === Mode.FKARR
    }

    get isRemoving() {
        return this.#mode === Mode.REMOVE
    }

    get pool() {
        return this.#pool
    }

    get name() {
        return this.#name
    }

    get mode() {
        return this.#mode
    }

    set mode(mode: Mode) {
        switch (mode) {
            case 'keep_alive':
                this.#mode = Mode.KEEP_ALIVE
                break
            case 'fkarr':
                this.#mode = Mode.FKARR
                break
            case 'remove':
                this.#mode = Mode.REMOVE
                break
        }
    }
}
