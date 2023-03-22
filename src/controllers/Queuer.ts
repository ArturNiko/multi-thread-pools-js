/**
 * Instead of our method, now we will you use this pool class to manage the flow and more...
 *
 */

type Pool = Function[]

export default class Queuer{

    #count: number = 0
    #pool: Pool = []

    public constructor(...method: Function[]) {
        this.push(...method)
    }
    public push(...method: Function[]){
        this.#pool.push(...method)
    }
    public remove(...pos: number[]){
        pos.forEach(i => this.#pool.splice(i, 1))
    }
    public pop(){
        this.#pool.pop()
    }
    public clear(){
        this.#pool = []
    }
}