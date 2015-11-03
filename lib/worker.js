
var errors = require('./errors');

module.exports = function worker(originalDocument, progress, resolve, reject) {
    
    var source = this.source;
    var target = this.target;
    var result = this.reducer(originalDocument);

    if (undefined === result || !(result instanceof Promise)) {
        throw new Error(errors.REDUCER_OUTPUT);
    }

    // push reducer's errors into an errors queue
    result.catch(function(reducerError) {
        var ref = source.child('errors').push();
        ref.set({
            ctime: Date.now(),
            error: reducerError,
            document: originalDocument
        }, function(err) {
            if (err) {
                reject({
                    msg: 'failed to push to the error stack',
                    error: err
                });
            } else {
                resolve();
            }
        });
    });

    // push reduced documents into the next queue
    result.then(function(reducedDocument) {
        console.log("DID IT", reducedDocument);
        var ref = target.child('tasks').push();
        ref.set(reducedDocument, function(err) {
            if (err) {
                reject({
                    msg: 'failed to push to the next queue',
                    error: err
                });
            } else {
                resolve();
            }
        });
    });


};
