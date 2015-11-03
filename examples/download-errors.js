
var fb = require('./_firebase');

/**
 * Error handling utility in action
 */

var firebaseQueueErrors = require('../lib/firebase-queue-errors');
var errorToFixture = require('../lib/error-to-fixture');


/**
 * Create an error handler that consumes the error queue into
 * local fixtures JSON files.
 */
var errorHandler = errorToFixture('./error-fixtures', function(err, fpath) {
    if (err) {
        console.log('FAILED', err);
    } else {
        console.log('SUCCESS', fpath);
    }
});

/*
// Or you can create a custom error handler to do whatever you need
// to do with the errors. You can even push the documents back to the queue!
//
// - if you `resolve()` the promise the error log will be removed
// - if you `reject()` the promise the error log will remain untoched
function errorHandler(error) {
    return new Promise(function(resolve, reject) {
        console.log(error);
        resolve();
    });
}
*/

/**
 * Start consuming the error logs for a given queue
 */
var errors = firebaseQueueErrors(fb.child('src'), errorHandler);

// gracefully shutdown to avoid data losses
process.on('SIGINT', function() {
    console.log('Gracefully start queue shutdown');
    errors.stop().then(function() {
        console.log('Finished queue shutdown');    
        process.exit(0);
    });
});

