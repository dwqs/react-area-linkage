export const assert = function assert (condition, msg = '') {
    if (!condition) {
        throw new Error(`[react-area-linkage]: ${msg}`);
    }
};

export const isArray = function isArray (param) {
    return Object.prototype.toString.call(param) === '[object Array]';
};
