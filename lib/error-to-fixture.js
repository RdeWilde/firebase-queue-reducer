
var fs = require('fs-extra');
var uuid = require('uuid');
var buildPath = require('./build-path');

function __noop() {}

function errorToFixture(_path, callback) {
    callback = callback || __noop;
    return function(error) {
        return new Promise(function(resolve, reject) {

            // try to build fixture file name from a fixtureId
            // property that can be optionally given to the error document
            var _fname;
            if (error.error.fixtureId) {
                _fname = error.error.fixtureId + '.json';
            } else {
                _fname = Date.now() + '_' + uuid.v1() + '.json';    
            }

            var _fpath = buildPath(_path, _fname);

            fs.outputJson(_fpath, error, function(err) {
                if (err) {
                    var _err = {
                        fpath: _fpath,
                        details: err
                    };
                    callback(_err);
                    return reject(_err);
                } else {
                    callback(null, _fpath);
                    resolve(_fpath);
                }
            });
        });
    }
}

module.exports = errorToFixture;
