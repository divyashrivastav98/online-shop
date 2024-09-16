const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db = undefined;

const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://divyzshrivastav98:TKu1KxKPXlw145qd@mongopractice.0srklxh.mongodb.net/shop?retryWrites=true&w=majority&appName=MongoPractice')
    .then(client => {
        console.log('Connected');
        _db = client.db();
        cb();
    }).catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
