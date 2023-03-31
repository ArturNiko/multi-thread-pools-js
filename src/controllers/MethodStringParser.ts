import {Nullable} from '../helpers/Types'

export default class MethodStringParser{
    #method: Nullable<Function>
    #methodString: string
    constructor(method: Nullable<Function>) {
        this.#method = method
        this.#methodString = this.#method ? this.#method.toString() : ''

    }
    prepare(): string{
        if(!this.#method) return ''

        this.#prepBeginning()
        this.#prepScope()

        return this.#methodString
    }

    #prepBeginning(){
        const parts: string[] = this.#methodString.split('(')
        let newMethodString: string = ''
        for (let i = 0; i < parts.length; i++){
            newMethodString += !i ? 'function' : parts[i]
            if(parts.length - 1 !== i) newMethodString += '('
        }

        this.#methodString = newMethodString
        return this.#methodString
    }

    #prepParams(): string{

        return this.#methodString
    }

    #prepScope(): string{

        return this.#methodString
    }

    get method() { return this.#method }
    set method(method: Nullable<Function>) { this.#method = method}
}