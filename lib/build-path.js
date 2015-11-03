
var path = require('path');

function buildPath(_path) {
    _path = _path || './';
    _path = _path.replace(/\/$/, '');

    if (!path.isAbsolute(_path)) {
        return path.normalize(path.join(process.cwd(), _path));
    }
    return _path;
}

module.exports = buildPath;
