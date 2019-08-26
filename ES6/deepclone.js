let deepClone = (value, hash = new WeakMap) => {
    if (value == null) return value;
    if (typeof value == "string") return value;
    if (typeof value == "number") return value;
    if (typeof value == "boolean") return value;
    if (typeof value == "function") return value;
    if (value instanceof Date) return value;
    if (value instanceof RegExp) return value;

    if (typeof value == "object") {
        let data = new value.constructor(value);

        if (hash.has(value)) {
            return hash.get(value);
        }
        hash.set(value, data)

        for (let key in data) {
            if (data.hasOwnProperty(key))
                data[key] = deepClone(data[key], hash);
        }
        return data;
    }
    return value
}