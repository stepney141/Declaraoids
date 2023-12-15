const declaraoids = require('../src/declaraoids');

const persons = [
    { name: "Fuyuko", age: 19, sex: "F", address: { city: "Ibaraki"} },
    { name: "Asahi", age: 14, sex: "F", address: { city: "Tokyo"} },
    { name: "Mei", age: 18, sex: "F", address: { city: "Saitama"} }
];
const result = declaraoids.findNameAndSexAsGenderWhereAgeLessThanXAndAddress_CityEqualsCity(persons, {x: 15, city: 'Tokyo'});

console.log(result);
