
var chai = require('chai');

var errors = require('../lib/errors');
var worker = require('../lib/worker');

describe('FirebaseQueueReducer', function() {

    describe('worker callback', function() {

        it('should return a promise', function() {
            chai.expect(function() {
                worker.bind({
                    reducer: function() {}
                })();
            }).to.throw(errors.REDUCER_OUTPUT);
        });

    });

});
