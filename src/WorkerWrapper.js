export default class WorkerWrapper{
    #worker = null

    #callback = async (message) => {
        this.#response = message.data
        this.#state = this.#states.READY
        this.#responseResolve()
    }

    #method = null
    #methodBytes = null
    #blob = null
    #url = null

    #response = null
    #responseResolve = function (){ /* populate resolve */ }

    #state
    #states = Object.freeze({
        RUNNING: 'running',
        READY: 'ready',
        SLEEPING: 'sleeping'
    })

    #controller; #name

    constructor(name, controller) {
        this.#name = name
        this.#controller = controller

        this.#state = this.#states.SLEEPING
    }

    create(method = null){
        if(!this.isSleeping || (typeof method !== 'function' && this.#method === null)) return
        this.#method = method || this.#method
        this.#methodBytes = new TextEncoder().encode(`onmessage = ${this.#method}`)
        this.#blob = new Blob([this.#methodBytes], {type: 'text/javascript'})
        this.#url = URL.createObjectURL(this.#blob)

        this.#worker = new Worker(this.#url)
        this.#worker.onmessage = this.#callback

        this.#state = this.#states.READY
    }

    async run(message = null){
        if (!this.isReady) return

        this.#worker.postMessage(message)
        this.#state = this.#states.RUNNING

        return new Promise(resolve => {
            this.#responseResolve = () => {
                resolve(this.#response)
            }
        })
    }


    restart(){
        this.softTerminate()
        this.create()
    }

    softTerminate(){
        if(this.isSleeping) return
        this.#worker.terminate()
        this.#worker = null

        this.#state = this.#states.SLEEPING
    }
    terminate(){
        if(this.isSleeping) return

        this.#method = null
        this.#methodBytes = null
        this.#blob = null
        this.#url = null

        this.#worker.terminate()
        this.#worker = null

        this.#state = this.#states.SLEEPING
    }

    destroy(){
        this.terminate()
        delete this.#controller[this.#name]
        delete this
    }

    get state(){ return this.#state }
    get method(){ return this.#method }
    get bytes(){ return this.#methodBytes }
    get worker(){ return this.#worker }
    get url(){ return this.#url }
    get callback(){ return this.#callback }
    get name(){ return this.#name }

    get isSleeping(){ return this.#state === this.#states.SLEEPING }
    get isRunning(){ return this.#state === this.#states.RUNNING }
    get isReady(){ return this.#state === this.#states.READY }

}
