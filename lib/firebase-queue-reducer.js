
var FirebaseQueue = require('firebase-queue');

var errors = require('./errors');
var worker = require('./worker');

function firbaseQueueReducer(config) {
    config = config || {};
    config.workers = config.workers || 1;

    if (undefined === config.source) {
        throw new Error(errors.MISSING_SOURCE);
    }

    if (undefined === config.target) {
        throw new Error(errors.MISSING_TARGET);
    }

    if (undefined === config.reducer) {
        throw new Error(errors.MISSING_REDUCER);
    }

    if ('number' !== typeof config.workers) {
        throw new Error(errors.WORKERS_FORMAT);
    }

    if ('function' !== typeof config.reducer) {
        throw new Error(errors.REDUCER_FORMAT);
    }

    return new FirebaseQueue(config.source, {numWorkers: config.workers}, worker.bind(config));
}

module.exports = firbaseQueueReducer;
