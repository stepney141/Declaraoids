let comparisons = ["NotEquals", "Equals", "LessThan", "GreaterThan", "Includes"];

export default function (query) {

    let {findQuery, whereQuery} = splitQuery(query);

    let find = generateFind(findQuery);
    let where = generateWhere(whereQuery);

    return {
        find,
        where
    }
};

function splitQuery(query) {
    let parts = query.split('Where');

    let findQuery = parts[0].substring(4);
    let whereQuery = parts[1];

    return {
        findQuery,
        whereQuery
    };
}

function generateFind(findQuery) {
    if (findQuery == '') return [];

    let parts = findQuery.split('And');

    return parts.map(part => {
        let [prop, name] = part.split('As');

        prop = convertBackToCamelCase(prop);

        return {
            prop: prop,
            name: name ? lowerCaseFirst(name) : prop
        }

    });
}

function generateWhere(whereQuery) {
    if (!whereQuery) {
        return [];
    }

    let parts = whereQuery.split('And');

    return parts.map(part => {
        let comparison = comparisons.find(c => part.includes(c));
        let split = part.split(comparison);

        return {
            property: convertBackToCamelCase(split[0]),
            comparison: comparison.toLowerCase(),
            input: lowerCaseFirst(split[1])
        };
    });

}

function convertBackToCamelCase(string) {
    return string.split('_').map(lowerCaseFirst).join('_');
}

function lowerCaseFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}