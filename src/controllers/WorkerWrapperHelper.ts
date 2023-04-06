import {Nullable} from '../types/Types'
import {WorkerWrapperHelperInterface} from '../types/Interfaces'

export default class WorkerWrapperHelper implements WorkerWrapperHelperInterface{
    #method: Nullable<Function>

    #scope: object = {}
    #params: string[] = []
    #methodString: string

    constructor(method: Nullable<Function>) {
        this.#method = method
        this.#methodString = this.#method ? this.#method.toString() : ''

        this.prepareString()
    }

    prepareString(): string{
        if(!this.#method) return this.#methodString
        this.#methodString = this.#method ? this.#method.toString() : ''
        this.#getParams()

        this.#prepareBeginning()
        this.#replaceScope()
        this.#replaceParams()
        return this.#methodString
    }

    prepareMessage(message: { [key: string]: any }, scope?: NonNullable<Object>): object{
        const newMessage: { [key: string]: any } = {}

        this.#params.forEach(param => newMessage[param] = (message ?? {})[param])

        newMessage['MTPC_this'] = scope ?? {}
        return newMessage
    }

    #prepareBeginning(){
        const parts: string[] = this.#methodString.split('(')
        let newMethodString: string = ''
        for (let i = 0; i < parts.length; i++){
            newMethodString += !i ? 'function' : parts[i]
            if(parts.length - 1 !== i) newMethodString += '('
        }
        this.#methodString = newMethodString
    }

    #replaceScope(){
        if(this.#methodString.match(/\bthis\b/g)) {
            this.#methodString = this.#methodString.replace(/\bthis\b/g, 'message.data.MTPC_this')
            this.#methodString = this.#methodString.replace(/(postMessage\({)/g, '$1 MTPC_this: message.data.MTPC_this,')
        }
        this.#methodString = this.#methodString.replace(new RegExp('([^\\.])(\\b(?:' + this.#params.join('|') + ')\\b[^:])', 'g'), `$1message.data.$2`)

    }

    #getParams(){
        const regOutput: Nullable<RegExpMatchArray> = this.#methodString.match(/\(([^)]+)\)/) // (...)

        if(regOutput) {
            this.#params = regOutput[1].split(',')
            for (let i = 0; this.#params.length > i; i++) this.#params[i] = this.#params[i].replace(/\s/g, '')
        }
    }

    #replaceParams(){
        this.#methodString = this.#methodString.replace(/\(([^)]+)\)/, ' (message)')
    }

    get methodString() { return this.#methodString }

    set method(method: Nullable<Function>) {
        this.#method = method
        this.prepareString()
    }
}