const MultithreadingController = require('../dist/index').MultithreadingController
const MC = require('../dist/index').default


describe('#Requiring', () => {
    it('Required properly', () => {
        expect(MC).toBeInstanceOf(MultithreadingController)
    })
})