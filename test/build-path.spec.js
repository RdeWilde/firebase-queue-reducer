
var path = require('path');
var expect = require('chai').expect;

var buildPath = require('../lib/build-path');

describe('buildPath()', function() {

    it('should compute local path', function() {
        var localPath = path.join(process.cwd(), '.');
        expect(buildPath()).to.equal(localPath);
    });

    it('should compute relative paths', function() {
        var localPath = path.normalize(path.join(process.cwd(), './fixtures'));
        expect(buildPath('./fixtures/')).to.equal(localPath);
    });

    it('should remove trailing slash from absolute paths', function() {
        expect(buildPath('/usr/bin/')).to.equal('/usr/bin');
    });

});
