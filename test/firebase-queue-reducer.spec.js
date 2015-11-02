
var chai = require('chai');

var firebaseQueueReducer = require('../index');
var errors = require('../lib/errors');
var worker = require('../lib/worker');

var voidReducer = function() {
    return new Promise(function() {});
};

describe('firebaseQueueReducer', function() {

    describe('configuration', function() {

        it('should require "source"', function() {
            chai.expect(function() {
                firebaseQueueReducer();
            }).to.throw(errors.MISSING_SOURCE);
        });

        it('should require "target"', function() {
            chai.expect(function() {
                firebaseQueueReducer({
                    source: {}
                });
            }).to.throw(errors.MISSING_TARGET);
        });

        it('should require "reducer"', function() {
            chai.expect(function() {
                firebaseQueueReducer({
                    source: {},
                    target: {}
                });
            }).to.throw(errors.MISSING_REDUCER);
        });

        it('should enforce "reducer" to be a function', function() {
            chai.expect(function() {
                firebaseQueueReducer({
                    source: {},
                    target: {},
                    reducer: 'a'
                });
            }).to.throw(errors.REDUCER_FORMAT);
        });

        it('should enforce "workers" to be an Integer', function() {
            chai.expect(function() {
                firebaseQueueReducer({
                    source: {},
                    target: {},
                    reducer: voidReducer,
                    workers: 'a'
                });
            }).to.throw(errors.WORKERS_FORMAT);
        });

    });

});
