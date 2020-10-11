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

exports.progress = (msg, progress) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg + ' ' + progress + '%');
}


// module.exports = log;