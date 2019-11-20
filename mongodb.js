// CRUD -> CREATE READ UPDATA DELETE

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database :(');
    }

    const db = client.db(databaseName);

    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID("5dd55aa39dba5d1d0c5caf2c")
    }, {
        $set: {
            name: 'Alicia'
        }
    });

    updatePromise.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
})