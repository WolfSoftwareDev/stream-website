module.exports = {
    MongoURI: process.env.MongoURI || 'mongodb+srv://<username>:<password>@<shard>/<database>?retryWrites=true&w=majority'
}
