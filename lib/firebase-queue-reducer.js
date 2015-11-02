
function FirbaseQueueReducer(config) {
    this.config = config || {};
    console.log(Object.keys(this.config));
}

module.exports = FirbaseQueueReducer;
