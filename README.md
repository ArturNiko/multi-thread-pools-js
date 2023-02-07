
## Multithread-js

#### Light and easy JS tool for accessing multiple threads via web workers.
<br />



### General

```javascript
import Threads from 'multithread-js'

/**
 * @param Number
 * limits the number of created threads. 
 * Maximum number is 'navigator.deviceMemory' value.
 */
Threads.initialize(8)

/**
 * Runs a showcase.
 */
Threads.test()


/**
 * Shows thread count limit.
 *
 */
Threads.limit


```
<br />

### Individual threads.

After we initialized threads we can access them.

```javascript
...

/**
 * Passed value is accessable under data subkey of the parameter.
 */

const square = function(param) {
    const v = param.data * param.data   
    
    postMessage(v)
}

/**
 * Passed value is accessable under data subkey of the parameter.
 */
const callback = function (message) {
    console.log(message.data)
}

/**
 * @param Function 
 * Function that will be called every time, when thread is called.
 * If no function passed, 'create' will be ignored.
 */

Threads.Thread_2.create(square)


/**
 * @param Function
 * Callback that will recieve the message back.
 * 
 */
Threads.Thread_2.callback = callback

/**
 * @param any
 * Parameter that will be passed to the function.
 */
Threads.Thread_2.run(2)


/**
 * Terminates the worker.
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

```
<br />

### Notes

Thread count goes from 2 up to `navigator.deviceMemory` value because 1 is the main thread.

You can create more threads than you have, but it's not recommended, so I limited it.