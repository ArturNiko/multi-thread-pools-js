
## Multithread-js

#### Light and easy JS tool for accessing multiple threads via web workers.
<br />



### General

```javascript
import Threads from 'multithread-js'

/**
 * @param Number
 * limits the number of created threads. 
 * Maximum number is 'navigator.deviceMemory / 2 - 1' value.
 * 
 * Initializes new threads/worker wrappers.
 */
Threads.initialize(4)

/**
 * Runs a showcase.
 */
Threads.test()

/**
 * @return Promise<Any>
 * Runs every available thread and returns the fastest resolved response.
 */
await Threads.race()


/**
 * @return Promise<Array>
 * Runs every available thread and returns every resolved response in array.
 */
await Threads.all()

/**
 * Restarts every thread.
 */
Threads.restart()

/**
 * @return Number
 * Shows thread count limit.
 *
 */
Threads.limit

/**
 * @return String
 * Shows threads controller mode: regular | race.
 *
 */
Threads.mode

```
<br />

### Individual threads

After we initialized threads we can access them.

```javascript
...

/**
 * Passed value is accessable under data subkey of the parameter.
 */

function testFunc(message) {
    const start = performance.now()
    let value = 0
    for (let i = 0; i < 1000000000; i++) value += i
    
    //postMessage is mandatory and should be used instead of return
    postMessage({start: performance.now() - start, param: message.data})
}


/**
 * @param Function?
 * Function that will be called every time, when thread is called.
 * If no function passed, 'create' will be ignored.
 * 
 * Creates worker for this thread.
 */

Threads.Thread_2.create(testFunc)

/**
 * @param any
 * Parameter that will be passed to the function.
 * 
 * Executes the thread function.
 */
await Threads.Thread_2.run(2)


/**
 * Restarts the thread.
 */
Threads.Thread_2.restart()

/**
 * Terminates only the worker.
 */
Threads.Thread_2.softTerminate()

/**
 * Terminates the worker and its settings.
 */
Threads.Thread_2.terminate()

/**
 * Terminates the worker and destroys the object.
 */
Threads.Thread_2.destroy()


/**
 * Getters.
 */
Threads.Thread_2.state
Threads.Thread_2.method
Threads.Thread_2.bytes
Threads.Thread_2.url
Threads.Thread_2.callback
Threads.Thread_2.name
Threads.Thread_2.isReady
Threads.Thread_2.isRunning
Threads.Thread_2.isSleeping

```
<br />

### Notes

Thread count goes from 2 up to `navigator.deviceMemory / 2 - 1` value because 1 is the main thread.

You can create more threads than you have, but it's not recommended, so I limited it.

Since version 0.2.0 callback is not editable.
