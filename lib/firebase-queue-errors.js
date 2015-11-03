
function firebaseQueueErrors(queue, errorHandler) {
    var errorsRef = queue.child('errors');
    var isActive = true;

    start();

    return {
        start: start.bind(this),
        stop: stop.bind(this)
    };

    function pull() {
        errorsRef.once('child_added', function(snap) {
            errorHandler(snap.val()).then(function() {
                snap.ref().remove(function() {
                    if (isActive) {
                        pull();
                    }
                });
            }).catch(pull);
        });
    }

    function start() {
        isActive = true;
        pull();
    }

    function stop() {
        return new Promise(function(resolve, reject) {
            isActive = false;
            setTimeout(resolve);
        });
    }
}

module.exports = firebaseQueueErrors;
