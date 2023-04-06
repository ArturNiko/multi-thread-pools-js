export type Nullable<T> = T | null | undefined

export enum WorkerState{
    RUNNING     = 'running',
    READY       = 'ready',
    SLEEPING    = 'sleeping',
}

export enum PoolMode {
    KEEP_ALIVE  = 'keep_alive',
    FKARR       = 'fkarr',  //First Keep Alive, Rest Remove
    REMOVE      = 'remove'
}


export enum RunMode {
    REGULAR     = 'regular',
    RACE        = 'race',
}


