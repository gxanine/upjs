const config = require('../config');

exports.info = (...args) => {
    console.log(...args);
};

exports.debug = (...args) => {
    if (!config.simple) console.log(...args);
};

exports.error = (...args) => {
    console.error(...args);
}


// module.exports = log;