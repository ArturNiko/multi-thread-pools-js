import WorkerWrapper from "./WorkerWrapper.js"

export default class ThreadsController{
    #threadPrefix
    #threadCount
    #threadLimit


    constructor() {
        this.#threadPrefix = 'Thread_'
        this.#threadLimit = navigator.deviceMemory - 1
    }

    initialize(limit = 999){
        this.#threadCount = Math.min(limit, this.#threadLimit)
        for (let i = 0; i < this.#threadCount; i++){
            const threadIndex = i + 2
            if(this[this.#threadPrefix + threadIndex] === undefined){
                this[this.#threadPrefix + threadIndex] = new WorkerWrapper(this.#threadPrefix + threadIndex, this)
            }
        }
    }

    test(){
        console.warn('Existing threads are going to be terminated.')
        console.log('Test stated.')

        Object.values(this).forEach((thread, i) => {

            //Testing
            thread.terminate()
            const testFunc = function (message) {
                const start = performance.now()
                let value = 0
                for (let i = 0; i < 1000000000; i++) value += i
                postMessage({start: start, id: message.data})
            }

            const callbackFunc = function (message) {
                const timeLapsed = performance.now() - message.data.start
                console.log(`Thread ${message.data.id} done the task in: ${timeLapsed} ms.`)
                thread.terminate()
            }
            thread.create(testFunc)
            thread.callback = callbackFunc
            thread.run(i)
        })
    }

    get limit() {
        return this.#threadLimit
    }

    /* Not recommended
    set limit(value) {
        this.#threadPrefix = value
    }
     */


    /* Future stuff
    race(){

    }

    all(){

    }
     */
}