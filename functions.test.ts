import { isTypeOnlyImportOrExportDeclaration } from "typescript"

const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    test('shuffleArray should return an array', () => {
        expect(shuffleArray()).toBe(shuffleArray)
    })

    test('shuffleArray should check that all the same items are in the array', () => {
        expect(shuffleArray()).toContain(shuffleArray)
    })
})