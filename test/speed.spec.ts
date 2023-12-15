import assert from 'assert';
import Benchmark from 'benchmark';
import declaraoids from '../src/declaraoids';

describe('Speed comparison', () => { // remove skip to include speed tests

    function simpleFilterMap(data) {
        return data
            .filter(p => p.age > 500)
            .map(p => p.name);
    }

    function simpleFinder(data) {
        return declaraoids.findNameWhereAgeGreaterThanX(data, {x: 500});
    }

    function advancedFilterMap(data) {
        return data
            .filter(p => p.age > 500)
            .filter(p => p.nested.nested3 < 750)
            .map(p => ({name: p.name, custom: p.nested.nested2}));
    }

    function advancedFinder(data) {
        return declaraoids
            .findNameAndNested_Nested2AsCustomWhereAgeGreaterThanXAndNested_Nested3LessThanY(data, {
                x: 500,
                y: 750
            });
    }

    function completeFunction(size) {
        return function() {
            console.log("Result with list of " + size + " items");
            for (let i = 0; i < this.length; i++) {
                console.log(this[i].toString())
            }

            console.log('Fastest is ' + this.filter('fastest').map('name'));
        };
    }

    describe('Check that they return equal', () => {
        it('Simple query', () => {
            let data = generateData(1000);

            let filterMap = simpleFilterMap(data);
            let found = simpleFinder(data);

            assert.deepEqual(filterMap, found);
        });
        it('Advanced query', () => {
            let data = generateData(1000);

            let filterMap = advancedFilterMap(data);
            let found = advancedFinder(data);

            assert.deepEqual(filterMap, found);
        });
    });


    it('Simple query', function () {
        this.timeout(60000);

        simpleQuery(50);
        simpleQuery(100000);

        function simpleQuery(size) {
            let data = generateData(size);
            let suite = new Benchmark.Suite;

            suite
                .add('Simple filter&map', function () {
                    simpleFilterMap(data);
                })
                .add('Simple declaraoids', function () {
                    simpleFinder(data);
                })
                .on('complete', completeFunction(size))
                .run();

        }
    });


    it('Advanced query', function () {
        this.timeout(60000);

        advancedQuery(50);
        advancedQuery(100000);

        function advancedQuery(size) {
            let data = generateData(size);
            let suite = new Benchmark.Suite;

            let cachedFinder = declaraoids.findNameAndNested_Nested2AsCustomWhereAgeGreaterThanXAndNested_Nested3LessThanY;

            suite
                .add('Advanced filter&map', function () {
                    advancedFilterMap(data);
                })
                .add('Advanced declaraoids', function () {
                    advancedFinder(data);
                })
                .add('Advanced declaraoids CACHED', function () {
                    cachedFinder(data, { x: 500, y: 750});
                })
                .on('complete', completeFunction(size))
                .run();

        }
    });
});

function generateData(size) {
    let data = [];

    for (let j = 0; j < size; j++) {
        data.push({
            name: "Name" + j,
            age: j,
            nested: {
                nested2: "yeye",
                nested3: j
            }
        })
    }

    return data;
}