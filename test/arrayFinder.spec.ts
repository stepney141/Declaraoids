import assert from 'assert';
import arrayFinder from '../src/arrayFinder';

let p1 = { name: "Mats", age: 25, sex: "M", address: { city: "Oslo"} };
let p2 = { name: "Kåre", age: 31, sex: "M", address: { city: "Bergen"} };
let p3 = { name: "Linn", age: 22, sex: "F", address: { city: "Bergen"} };


describe('ArrayFinder', () => {

    it('calls underlying array when not starting with find', () => {
        let arr = arrayFinder([p1, p2, p3]);

        assert.deepEqual(p3, arr[2]);
        assert.equal(3, arr.length);
    });

    describe('find variables', () => {
        it('return all when no find specified', () => {
            let arr = arrayFinder([p1, p2, p3]);
            let result = arr.find();

            assert.deepEqual(result, [p1, p2, p3])
        });

        it('should find a single variable, name', () => {
            let arr = arrayFinder([p1, p2, p3]);
            let result = arr.findName();

            let expected = ["Mats", "Kåre", "Linn"];

            assert.deepEqual(result, expected)
        });

        it('should filter', () => {
            let arr = arrayFinder([p1, p2, p3]);
            let result = arr.findNameWhereAgeEqualsX({x: 25});

            let expected = ["Mats"];

            assert.deepEqual(result, expected)
        });
    });
});