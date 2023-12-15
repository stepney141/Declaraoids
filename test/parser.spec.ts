import assert from 'assert';
import parser from '../src/parser';

// Query should be on the form findNameAndAgeAsRealAgeWhereAddress_CityEqualsCity

describe('Parser', () => {
    describe('find clause', () => {
        it('nothing when nothing specified', () => {
            let expected = [];
            assert.deepEqual(parser('find').find, expected);
        });

        it('finds a single variable', () => {
            let expected = ['name'];
            let result = parser('findName').find;
            assert.deepEqual(result.map(e => e.prop), expected);
        });

        it('finds multiple variables', () => {
            let result = parser('findNameAndAddress').find;
            let expected = ['name', 'address'];
            assert.deepEqual(result.map(e => e.prop), expected);
        });

        it('assumes camelCase', () => {
            let result = parser('findNameAndStreetAddress').find;
            let expected = ['name', 'streetAddress'];
            assert.deepEqual(result.map(e => e.prop), expected);
        });

        it('finds nested properties and camelCases them', () => {
            let result = parser('findLastNameAndAddress_HouseNumber').find;
            let expected = ['lastName', 'address_houseNumber'];
            assert.deepEqual(result.map(e => e.prop), expected);
        });

        it('can rename the selected properties', () => {
            let result = parser('findLastNameAndAddress_HouseNumberAsHouseNumber').find;
            let expected = [{prop: 'lastName', name: 'lastName'}, {prop: 'address_houseNumber', name: 'houseNumber'}];
            assert.deepEqual(result, expected);
        });
    });

    describe('where clause', () => {
        it('a single equals clause', () => {
            let query = 'findSomethingWhereFirstNameEqualsX';
            let expected = [{
                property: 'firstName',
                comparison: 'equals',
                input: 'x'
            }];
            assert.deepEqual(parser(query).where, expected);
        });

        it('multiple clauses', () => {
            let input = 'findSomethingWhereFirstNameNotEqualsFirstNameAndLastNameEqualsLast';

            let expected = [{
                property: 'firstName',
                comparison: 'notequals',
                input: 'firstName'
            }, {
                property: 'lastName',
                comparison: 'equals',
                input: 'last'
            }];
            assert.deepEqual(parser(input).where, expected);
        });

        it('where on a nested property', () => {
            let input = 'findSomethingWhereAddress_StreetNameIncludesStreetName';

            let expected = [{
                property: 'address_streetName',
                comparison: 'includes',
                input: 'streetName'
            }];

            assert.deepEqual(parser(input).where, expected);
        });
    });

});