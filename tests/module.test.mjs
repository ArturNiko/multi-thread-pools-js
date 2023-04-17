import {describe, it, expect} from 'vitest'
import MC, {MultithreadingController} from '../dist/index.mjs'

describe('#Importing', () => {
    it('Required properly', () => {
        expect(MC).toBeInstanceOf(MultithreadingController)
    })
})




