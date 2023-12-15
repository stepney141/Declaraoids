import parser from './parser';

export default new Proxy({}, {
    get (target, property) {
        return finder(property);
    }
});

function finder(query) {
    let parsed = parser(query);

    let mapFunc = generateMapFunction(parsed);
    let filterFunc = generateFilterFunction(parsed);

    return (array, args) => {
        return array
            .filter(filterFunc(args))
            .map(mapFunc);
    }
}

function generateMapFunction(parsed) {
    if (parsed.find.length == 0) {
        return e => e;
    }

    if (parsed.find.length == 1) {
        return e => findNested(e, parsed.find[0].prop);
    }

    return e => {
        let obj = {};
        parsed.find.forEach(find => {
            obj[find.name] = findNested(e, find.prop);
        });
        return obj;
    };
}


let functions = {
    equals: (value, compareWith) => value === compareWith,
    noteequals: (value, compareWith) => value !== compareWith,
    lessthan: (value, compareWith) => value < compareWith,
    greaterthan: (value, compareWith) => value > compareWith,
    includes: (value, compareWith) => value.includes(compareWith)
};

function generateFilterFunction(parsed) {
    let filters = [];

    parsed.where.forEach(where => {
        let func = functions[where.comparison];

        filters.push((e, args) => {
            let value = findNested(e, where.property);
            let compareWith = args[where.input];
            return func(value, compareWith);
        })
    });

    return args => e => filters.every(f => f(e, args));

}

function findNested(start, path) {
    if (!path.includes('_')) {
        return start[path];
    }

    let properties = path.split('_');

    let current = start;
    for (let i = 0; i < properties.length; i++) {
        current = current[properties[i]];
    }
    return current;
}