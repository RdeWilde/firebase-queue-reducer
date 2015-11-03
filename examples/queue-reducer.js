
var fb = require('./_firebase');

/**
 * Reducer in Action
 */

var firebaseQueueReducer = require('../index');

// this is the business logic you have to provide in order
// to reduce a document. 
//
// it uses _promises_ so it can handle heavy asynchronous taks.
function reducerCallback(originalDocument) {
    return new Promise(function(resolve, reject) {
        if (originalDocument.ctime % 2 === 0) {
            resolve({
                ctime: originalDocument.ctime,
                fullName: [originalDocument.firstName, originalDocument.lastName].join(' ')
            });
        } else {
            
            if (Date.now() % 2 === 0) {
                reject({
                    fixtureId: originalDocument.ctime,
                    msg: 'it was not EVEN enough'
                });
            } else {
                reject('simple error with no details');
            }
        }
    });
}

// setup the queue reducing structure
var queue = firebaseQueueReducer({
    source: fb.child('src'),
    target: fb.child('dest'),
    reducer: reducerCallback,
    workers: 5
});

// gracefully shutdown to avoid data losses
process.on('SIGINT', function() {
    console.log('Gracefully start queue shutdown');
    queue.shutdown().then(function() {
        console.log('Finished queue shutdown');    
        process.exit(0);
    });
});

/**
 * Fake Data Generation
 */

var random_name = require('node-random-name');

function pushFakeData(count) {
    count = undefined === count ? 100 : count;
    fb.child('src/tasks').push({
        firstName: random_name({first: true}),
        lastName: random_name({last: true}),
        ctime: Date.now()
    });
    if (count > 0) {
        setTimeout(pushFakeData(count - 1));
    }
}

// comment the line below to avoid generate new data
pushFakeData();
