import assert from 'assert';
import declaraoids from '../src/declaraoids';

let p1 = { name: "Mats", age: 25, sex: "M", address: { city: "Oslo"} };
let p2 = { name: "Kåre", age: 31, sex: "M", address: { city: "Bergen"} };
let p3 = { name: "Linn", age: 22, sex: "F", address: { city: "Bergen"} };


describe('Declaraoids Find', () => {
    let array2 = [p1, p2];
    let array3 = [p1, p2, p3];


    describe('find variables', () => {
        it('return all when no find specified', () => {
            let func = declaraoids.find;
            let result = func(array3);

            assert.deepEqual(result, [p1, p2, p3])
        });

        it('should find a single variable, name', () => {
            let result = declaraoids.findName(array3);

            let expected = ["Mats", "Kåre", "Linn"];

            assert.deepEqual(result, expected)
        });

        it('should find multiple variables, name and age', () => {
            let result = declaraoids.findNameAndAge(array2);
            let expected = [{
                name: "Mats",
                age: 25
            }, {
                name: "Kåre",
                age: 31
            }];
            assert.deepEqual(result, expected)
        });

        it('should find nested variables', () => {
            let result = declaraoids.findNameAndAddress_City(array2);
            let expected = [{
                name: "Mats",
                address_city: "Oslo"
            }, {
                name: "Kåre",
                address_city: "Bergen"
            }];
            assert.deepEqual(result, expected)
        });

        describe('supernested', () => {
            let input = {
                levelOne: {
                    levelTwo: {
                        levelThree: {
                            levelFour: "hey"
                        },
                        alsoLevelThree: "three"
                    }
                }
            };

            it('should find supernested variables', () => {
                let result = declaraoids.findLevelOne_LevelTwo_LevelThree([input]);
                let expected = [{
                    levelFour: "hey"
                }];
                assert.deepEqual(result, expected)
            });

            it('should find variables at different levels', () => {
                let result = declaraoids.findLevelOne_LevelTwo_LevelThreeAndLevelOne_LevelTwo_AlsoLevelThree([input]);
                let expected = [{
                    levelOne_levelTwo_levelThree: {
                        levelFour: "hey"
                    },
                    levelOne_levelTwo_alsoLevelThree: "three"
                }];
                assert.deepEqual(result, expected)
            });

            it('should rename nested to shorter', () => {
                let result = declaraoids.findLevelOne_LevelTwo_LevelThreeAsHelloKittyAndLevelOne_LevelTwo_AlsoLevelThreeAsShort([input]);
                let expected = [{
                    helloKitty: {
                        levelFour: "hey"
                    },
                    short: "three"
                }];
                assert.deepEqual(result, expected)
            });
        });

    });

    describe('Filter on where', () => {
        it('equals', () => {
            let result = declaraoids.findWhereNameEqualsName(array3, {name: "Mats"});
            let expected = [p1];
            assert.deepEqual(result, expected)
        });

        it('multiple filters, greater than', () => {
            let result = declaraoids.findWhereSexEqualsGenderAndAgeGreaterThanNr(array3, {gender: "M", nr: 30});
            let expected = [p2];
            assert.deepEqual(result, expected)
        });

        it('nested where', () => {
            let result = declaraoids.findWhereAddress_CityEqualsCity(array3, {city: 'Bergen'});
            let expected = [p2, p3];
            assert.deepEqual(result, expected)
        });
    });

    it('Show-off', () => {
        let data = {
            title: "A cool article",
            author: {
                name: "Mats",
                address: {
                    city: "Oslo",
                    zip: "0567"
                }
            },
            content: {
                ingress: "A cool ingress",
                fullText: "A long text....",
                totalWords: 500
            }
        };

        let result = declaraoids.findTitleAndAuthor_NameAsAuthorWhereAuthor_Address_ZipEqualsZipAndContent_IngressIncludesXAndContent_TotalWordsGreaterThanWords([data], {zip: '0567', x: 'cool', words: 400});
        assert.deepEqual(result, [{title: "A cool article", author: "Mats"}]);
    });
});