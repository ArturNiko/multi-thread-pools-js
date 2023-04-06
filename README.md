<img src="./assets/MC_Dark.png">


### Light and easy JS tool for accessing multiple threads via web workers.
<br />

## Features 

- Access to multiple threads.
- Possibility to chain workers for each individual thread (Up to 64).
- Multiple modes for each thread pool (keep alive | remove | First Keep Alive Rest Remove).
- Race and regular modus for all threads.
- Access to object parameters ("rescoping") and their modification.
<br />


## Notes

Current version of the module is `< 1.0.0`, so it could be unstable.

<br />


## General

```javascript
import MC from '@a4turp/multithreading'

/**
 * @param Number
 * Limits the number of created threads. 
 * Maximum number is 'navigator.hardwareConcurrency - 1' value.
 * 
 * @description Initializes new threads/worker wrappers.
 */
MC.initialize(999)


```

```javascript
/**
 * @param Boolean
 * Log out showcase notifications.
 * 
 * @description Runs a showcase.
 */
MC.test(true)
```

```javascript
/**
 * @param any
 * The Parameter which is going to be passed to the functions of every worker in every thread pool.
 * @return Promise<Any>
 *     
 * @description Runs every available thread pool and returns the fastest resolved response.
 */
await MC.race()
```

```javascript
/**
 * @param any
 * The Parameter which is going to be passed to the functions of every worker in every thread pool.
 * @return Promise<Array>
 *     
 * @description Runs every available thread pool and returns every resolved response in array.
 */
await MC.all()
```

```javascript
/**
 * @description Restarts every thread pool.
 */
MC.restart()
```

```javascript
// Getters
MC.limit //Thread count limit.
MC.mode //Threads controller mode: regular | race.
```

```javascript
// Setters

/**
 * @type 'keep_alive'|'fkarr'|'remove'
 * @description sets pool mode for every thread pool.
 * 'keep_alive' After running thread, all workers remain.
 * 'fkarr' After running thread, only irst worker remains.
 * 'remove' After running thread, all workers are getting removed.
 *
 */
MC.threadsMode
```
<br />


## Individual pool

After we initialized threads we can access our pools.

```javascript

/**
 *  @description 
 *      Passed value is accessable under data subkey of the parameter.
 *      Chained function will get computed message of previous function.
 *      
 *  @note 
 *      Chained methods will accept only their own parameters.
 *      It means: only 'message' and 'exec_time' keys are accessible from previous message.
 */
function testFunc(message, exec_time) {
    const start = performance.now()
    let value = 0
    for (let i = 0; i < 1000000000; i++) value += i
    

    //postMessage is mandatory and should be used instead of return
    postMessage({
        exec_time: performance.now() - start + (exec_time ?? 0),
        message: message
    })
}

MC.threads[0].add(testFunc, /* ... */)
MC.add(0, testFunc, /* ... */)
```

```javascript
/**
 * @param any
 * The Parameter which is going to be passed to the functions of every worker.
 * @return Promise<any>
 *
 * @description Runs every worker one after the other in the pool.
 */
MC.threads[0].run('your massage')
MC.run(0, 'your massage')
```

```javascript
/**
 * @param Number
 * Position of the worker in array.
 * 
 * @description Removes worker from the pool.
 */
MC.threads[0].remove()
MC.remove(0)
```

```javascript
/**
 * @description Removes last worker from the pool.
 */
MC.threads[0].pop()
MC.pop(0)
```

```javascript
/**
 * @description Clears the pool.
 */
MC.threads[0].clear()
MC.clear(0)
```

```javascript
/**
 * @description Terminates only the worker in the pool.
 */
MC.threads[0].softTerminate()
MC.softTerminate(0)
```

```javascript
/**
 * @description Terminates the worker and its settings in the pool.
 */
MC.threads[0].terminate()
MC.terminate(0)
```

```javascript
/**
 * @description Restarts workers in the pool. 
 */
MC.threads[0].restart()
MC.restart(0)
```

```javascript
// Getters
MC.threads[0].state //State of the pool.
MC.threads[0].pool //Workers array.
MC.threads[0].name //Name of the pool.
MC.threads[0].mode //Pool mode 'keep_alive'|'fkarr'|'remove'.

MC.threads[0].isKeepingAlive //Pool keeps workers alive?
MC.threads[0].isFKARR //Pool keeps only first worker alive?
MC.threads[0].isRemoving //Pool removes all workers?
```

```javascript
// Setters

/**
 * @type 'keep_alive'|'fkarr'|'remove'
 * @description sets pool mode.
 * 'keep_alive' After running thread, all workers remain.
 * 'fkarr' After running thread, only first worker remains.
 * 'remove' After running thread, all workers are getting removed.
 * 
 */
MC.threads[0].pool[0].mode
```
<br />


## Individual thread

After adding workers in our thread pools, we can access each of them in `pool` sub key of WorkerPool class.

```javascript
// .....

function testFunc(message) { /*...*/ }

/**
 * @param Function?
 * Function that will be called every time, when worker is called.
 * If no function passed, 'create' will be ignored.
 * 
 * @description Initializes worker in certain thread pool.
 */

MC.threads[0].pool[0].initialize(testFunc, testFunc)
```

```javascript
/**
 * @param any
 * The Parameter which is going to be passed to the function.
 * @return Promise<any>
 * 
 * @description Executes the worker function.
 */
await MC.threads[0].pool[0].run('your message')
```

```javascript
/**
 * @description Restarts the worker.
 */
MC.threads[0].pool[0].restart()
```

```javascript
/**
 * @description Terminates only the worker.
 */
MC.threads[0].pool[0].softTerminate()
```

```javascript
/**
 * @description Terminates the worker and its settings.
 */
MC.threads[0].pool[0].terminate()
```

```javascript
// Getters
MC.threads[0].pool[0].state //state of the worker.
MC.threads[0].pool[0].method //eval(method).
MC.threads[0].pool[0].bytes //uint8 array buffer of method.
MC.threads[0].pool[0].url //worker url.

MC.threads[0].pool[0].isReady //worker is ready?
MC.threads[0].pool[0].isRunning //worker is running?
MC.threads[0].pool[0].isSleeping //worker is sleeping?
```
<br />


## Changes

| Version |  Type   |   Date   | Description                                                   |
|---------|:-------:|:--------:|:--------------------------------------------------------------|
| 0.2.0   | change  | 10.02.23 | Callback is not editable.                                     |
| 0.4.0   | change  | 28.03.23 | Threads limit changed to `navigator.hardwareConcurrency` - 1. |
| 0.4.0   | change  | 28.03.23 | Threads are located in 'threads' array parameter.             |
| 0.4.0   | change  | 28.03.23 | Threads are pools of worker wrappers.                         |
| 0.4.0   | feature | 28.03.23 | Pools are able to chain functions. 🤩                         |
| 0.4.0   | change  | 28.03.23 | Workers are now getting initialized my `initialize` method.   |
| 0.4.1   |  fix⚠️  | 29.03.23 | Fixed method parsing for static and regular class methods.    |
| 0.5.0   |  fix⚠️  | 30.03.23 | Finally fixed import for npm.                                 |
| 0.5.0   | feature | 30.03.23 | Finally added `require` support.                              |
| 0.6.0   | feature | 07.04.23 | Support of scope modification. ⭐️                             |
| 0.6.0   | change  | 07.04.23 | Pool access shortcuts.                                        |

