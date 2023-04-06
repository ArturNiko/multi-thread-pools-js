import {Nullable, WorkerState as State} from '../types/Types'
import {WorkerWrapperInterface} from '../types/Interfaces'

import WorkerWrapperHelper from './WorkerWrapperHelper'
export default class WorkerWrapper implements WorkerWrapperInterface{
    #callback = async (message: MessageEvent) => {
        this.#response = message.data
        this.#state = State.READY
        this.#responseResolve()
    }

    #worker: Nullable<Worker>
    #method: Nullable<Function> = null
    #scope: NonNullable<{ [key: string]: any }> = {} //returns {} if undefined|null
    #methodBytes: Nullable<Uint8Array> = null
    #blob: Nullable<Blob> = null
    #url: Nullable<string> = null
    #state: State = State.SLEEPING

    #response: any = {}
    #responseResolve = function (){ /* populate resolve */ }

    #helper: WorkerWrapperHelper = new WorkerWrapperHelper(null)
    constructor() {}
    initialize(method: Nullable<Function> = null){
        if(!this.isSleeping || (typeof method !== 'function' && this.#method === null)) return
        this.#helper.method = method ?? this.#method
        this.#methodBytes = new TextEncoder().encode(`onmessage = ${this.#helper.methodString}`)
        this.#blob = new Blob([this.#methodBytes], {type: 'text/javascript'})
        this.#url = URL.createObjectURL(this.#blob)

        this.#worker = new Worker(this.#url)
        this.#worker.onmessage = this.#callback

        this.#state = State.READY
    }

    async run(message: any, scope?: NonNullable<{ [key: string]: any }>): Promise<any>{
        if (!this.isReady || !(this.#worker instanceof Worker)) return {}
        this.#worker.postMessage(this.#helper.prepareMessage(message, scope ?? this.#scope))
        this.#state = State.RUNNING
        return new Promise(resolve => {
            this.#responseResolve = () => {
                if(scope && this.#response['MTPC_this'] !== undefined) Object.entries(this.#response['MTPC_this']).forEach(entry => {
                    const [key ,value] = entry
                    if(scope.hasOwnProperty(key)) scope[key] = value
                })
                resolve(this.#response)
            }
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
    get blob(){ return this.#blob }
    get url(){ return this.#url }
    get scope(){ return this.#scope }
    get isSleeping(){ return this.#state === State.SLEEPING }
    get isRunning(){ return this.#state === State.RUNNING }
    get isReady(){ return this.#state === State.READY }

    set scope(scope: NonNullable<{ [key: string]: any }>){
        this.#scope = scope
    }
}