import {Nullable} from "../helpers/Types"
import {WorkerWrapperInterface} from "../helpers/Interfaces"

import ThreadsController from "./ThreadsController"




type State = States.RUNNING | States.READY | States.SLEEPING
enum States{
    RUNNING = 'running',
    READY = 'ready',
    SLEEPING = 'sleeping',
}

export default class WorkerWrapper implements WorkerWrapperInterface{
    #worker: Nullable<Worker>
    private _callback = async (message: MessageEvent) => {
        this.#response = message.data
        this.#state = States.READY
        this.#responseResolve()
    }

    #method: Nullable<Function> = null
    #methodBytes: Nullable<Uint8Array> = null
    #blob: Nullable<Blob> = null
    #url: Nullable<string> = null
    #state: State

    #response: any = null
    #responseResolve = function (){ /* populate resolve */ }


    readonly #controller: ThreadsController
    readonly #name: string

    constructor(name: string, controller: ThreadsController) {
        this.#name = name
        this.#controller = controller

        this.#state = States.SLEEPING
    }

    create(method: Nullable<Function> = null){
        if(!this.isSleeping || (typeof method !== 'function' && this.#method === null)) return
        this.#method = method || this.#method
        this.#methodBytes = new TextEncoder().encode(`onmessage = ${this.#method}`)
        this.#blob = new Blob([this.#methodBytes], {type: 'text/javascript'})
        this.#url = URL.createObjectURL(this.#blob)

        this.#worker = new Worker(this.#url)
        this.#worker.onmessage = this._callback

        this.#state = States.READY
    }

    async run(message: any = null){
        if (!this.isReady || !(this.#worker instanceof Worker)) return

        this.#worker.postMessage(message)
        this.#state = States.RUNNING

        return new Promise(resolve => {
            this.#responseResolve = () => resolve(this.#response)
        })
    }

    restart(){
        this.softTerminate()
        this.create()
    }

    softTerminate(){
        if(this.isSleeping || !(this.#worker instanceof Worker)) return
        this.#worker.terminate()
        this.#worker = null

        this.#state = States.SLEEPING
    }

    terminate(){
        if(this.isSleeping || !(this.#worker instanceof Worker)) return

        this.#method = null
        this.#methodBytes = null
        this.#blob = null
        this.#url = null

        this.#worker.terminate()
        this.#worker = null

        this.#state = States.SLEEPING
    }

    destroy(){
        this.terminate()
        delete this.#controller[this.name as keyof ThreadsController]
        //delete this
    }

    get state(){ return this.#state }
    get method(){ return this.#method }
    get bytes(){ return this.#methodBytes }
    get url(){ return this.#url }
    get callback(){ return this._callback }
    get name(){ return this.#name }

    get isSleeping(){ return this.#state === States.SLEEPING }
    get isRunning(){ return this.#state === States.RUNNING }
    get isReady(){ return this.#state === States.READY }

}
