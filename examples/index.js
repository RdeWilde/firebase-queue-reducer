
var Firebase = require('firebase');
var fb = new Firebase('peg-dev.firebaseio.com');




/**
 * Reducer in action
 */

var FirebaseQueueReducer = require('../index');

var reducer = new FirebaseQueueReducer({
    from: fb.child('src'),
    to: fb.child('dest')
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
// pushFakeData();
