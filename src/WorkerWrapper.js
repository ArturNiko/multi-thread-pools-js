export default class WorkerWrapper{
    #worker = null

    #callback = null
    #method = null
    #methodBytes = null
    #blob = null
    #url = null

    #state; #states = Object.freeze({
        RUNNING: 'running',
        SLEEPING: 'sleeping'
    })

    #controller; #name

    constructor(name, controller) {
        this.#name = name
        this.#controller = controller

        this.#state = this.#states.SLEEPING
    }

    create(method){
        if(this.#state !== this.#states.SLEEPING || typeof method !== 'function') return
        this.#method = method
        this.#methodBytes = new TextEncoder().encode(`onmessage = ${this.#method}`)
        this.#blob = new Blob([this.#methodBytes], {type: 'text/javascript'})
        this.#url = URL.createObjectURL(this.#blob)

        this.#worker = new Worker(this.#url)
        this.#state = this.#states.RUNNING
    }

    run(message = null){
        if (this.#state !== this.#states.RUNNING) return
        this.#worker.postMessage(message)
    }

    terminate(){
        if(this.#state === this.#states.SLEEPING) return

        this.#method = null
        this.#callback = null
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

    set callback(callback) {
        if (typeof callback !== 'function') return
        this.#callback = callback

        if (this.#state !== this.#states.RUNNING) return
        this.#worker.onmessage = callback
    }

    get state(){ return this.#state }
    get method(){ return this.#method }
    get bytes(){ return this.#methodBytes }
    get url(){ return this.#url }
    get callback(){ return this.#callback }
}
