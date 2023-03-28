import {WorkerWrapperInterface} from '../helpers/Interfaces'
import {Nullable, WorkerState as State} from '../helpers/Types'
export default class WorkerWrapper implements WorkerWrapperInterface{
    #callback = async (message: MessageEvent) => {
        this.#response = message.data
        this.#state = State.READY
        this.#responseResolve()
    }

    #worker: Nullable<Worker>
    #method: Nullable<Function> = null
    #methodBytes: Nullable<Uint8Array> = null
    #blob: Nullable<Blob> = null
    #url: Nullable<string> = null
    #state: State = State.SLEEPING

    #response: any = null
    #responseResolve = function (){ /* populate resolve */ }

    constructor() {}

    initialize(method: Nullable<Function> = null){
        if(!this.isSleeping || (typeof method !== 'function' && this.#method === null)) return
        this.#method = method || this.#method
        this.#methodBytes = new TextEncoder().encode(`onmessage = ${this.#method}`)
        this.#blob = new Blob([this.#methodBytes], {type: 'text/javascript'})
        this.#url = URL.createObjectURL(this.#blob)

        this.#worker = new Worker(this.#url)
        this.#worker.onmessage = this.#callback

        this.#state = State.READY
    }

    async run(message: any = null){
        if (!this.isReady || !(this.#worker instanceof Worker)) return

        this.#worker.postMessage(message)
        this.#state = State.RUNNING

        return new Promise(resolve => {
            this.#responseResolve = () => resolve(this.#response)
        })
    }

    softTerminate(){
        if(this.isSleeping || !(this.#worker instanceof Worker)) return
        this.#worker.terminate()
        this.#worker = null

        this.#state = State.SLEEPING
    }

    terminate(){
        if(this.isSleeping || !(this.#worker instanceof Worker)) return
        this.softTerminate()

        this.#method = null
        this.#methodBytes = null
        this.#blob = null
        this.#url = null
    }

    restart(){
        this.softTerminate()
        this.initialize()
    }

    get state(){ return this.#state }
    get method(){ return this.#method }
    get bytes(){ return this.#methodBytes }
    get url(){ return this.#url }

    get isSleeping(){ return this.#state === State.SLEEPING }
    get isRunning(){ return this.#state === State.RUNNING }
    get isReady(){ return this.#state === State.READY }

}