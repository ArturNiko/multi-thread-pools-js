import {PoolMode, PoolMode as Mode} from '../helpers/Types'
import {WorkersPoolInterface} from '../helpers/Interfaces'

import WorkerWrapper from './WorkerWrapper'
import MultiThreadPoolController from './MultiThreadPoolController'

export default class WorkersPool implements WorkersPoolInterface{
    #pool: WorkerWrapper[] = []
    #mode: Mode = Mode.KEEP_ALIVE

    readonly #controller: MultiThreadPoolController
    readonly #name: string
    readonly #poolMaxSize: number = 64

    constructor(name: string, controller: MultiThreadPoolController) {
        this.#name = name
        this.#controller = controller
    }
    public add(...methods: Function[]){
        methods.forEach(method => {
            if(this.#pool.length >= this.#poolMaxSize) return
            const workerWrapper = new WorkerWrapper()
            workerWrapper.initialize(method)

            this.#pool.push(workerWrapper)
        })
    }

    public run(message: any = null): Promise<any>{
        return new Promise(async resolve => {
            for (let i = 0; i < this.#pool.length; i++){
                message = await this.#pool[i].run(message)
                if(this.isRemoving || (this.isFKARR && i > 0)) this.remove(--i)
            }
            resolve(message)
        })
    }

    public remove(...pos: number[]){
        pos.forEach(i => {
            if (this.#pool[i]){
                this.#pool[i].terminate()
                this.#pool.splice(i, 1)
            }
        })
    }
    public pop(){
        if(this.#pool.length){
            this.#pool[this.#pool.length - 1].terminate()
            this.#pool.pop()
        }
    }
    public clear(){
        this.#pool.forEach(wrapper => wrapper.terminate())
        this.#pool = []
    }

    public softTerminate(){
        this.#pool.forEach(wrapper => wrapper.softTerminate())
    }
    public terminate(){
        this.#pool.forEach(wrapper => wrapper.terminate())
    }
    public restart(){
        this.#pool.forEach(wrapper => wrapper.restart())
    }

    get isKeepingAlive(){ return this.#mode === Mode.KEEP_ALIVE }
    get isFKARR(){ return this.#mode === Mode.FKARR }
    get isRemoving(){ return this.#mode === Mode.REMOVE }

    get pool() { return this.#pool }
    get name(){ return this.#name }
    get mode(){ return this.#mode }

    set mode(mode: PoolMode) {
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
