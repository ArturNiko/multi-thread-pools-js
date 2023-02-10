import WorkerWrapper from "./WorkerWrapper.js"

export default class ThreadsController {
    #threadPrefix
    #threadCount
    #threadLimit

    #mode

    #modes = Object.freeze({
        REGULAR: 'regular',
        RACE: 'race',
    })

    constructor() {
        this.#threadPrefix = 'Thread_'
        this.#threadLimit = navigator.deviceMemory / 2 - 1
        this.#mode = this.#modes.REGULAR
    }

    initialize(limit = 999) {
        this.#threadCount = Math.min(limit, this.#threadLimit)
        for (let i = 0; i < this.#threadCount; i++) {
            const threadIndex = i + 2
            if (this[this.#threadPrefix + threadIndex] === undefined) {
                this[this.#threadPrefix + threadIndex] = new WorkerWrapper(this.#threadPrefix + threadIndex, this)
            }
        }
    }

    test() {
        console.warn('Existing threads are going to be terminated.')
        console.log('Test stated.')

        Object.values(this).forEach(thread => {
            //Testing
            thread.terminate()
            const testFunc = function (message) {
                const start = performance.now()
                let value = 0
                for (let i = 0; i < 1000000000; i++) value += i
                console.log({start: performance.now() - start, name: message.data})
                postMessage({start: performance.now() - start, name: message.data})
            }

            thread.create(testFunc)
            thread.run(thread.name)
        })
    }

    async race(message) {
        if(this.#mode === this.#modes.RACE) return
        this.#mode = this.#modes.RACE

        const promises = []
        Object.values(this).forEach(thread =>  {
            if(thread.isReady) promises.push(thread.run(message))
        })

        return await Promise.race(promises).then((value) => {
            this.restart()
            this.#mode = this.#modes.REGULAR
            return value
        })
    }

    async all(message) {
        const promises = []

        Object.values(this).forEach(thread => {
            if(thread.isReady) promises.push(thread.run(message))
        })

        return await Promise.all(promises)
    }

    restart() {
        Object.values(this).forEach(thread => {
            thread.restart()
        })
    }

    get limit() { return this.#threadLimit }
    get mode() { return this.#mode }
}