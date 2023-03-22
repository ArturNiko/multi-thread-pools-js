export default class Pool{

    #count: number = 0
    #pool: Function[] = []

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