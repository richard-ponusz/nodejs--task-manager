// CRUD -> CREATE READ UPDATA DELETE

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database :(');
  }

  const db = client.db(databaseName);

  db.collection('users').updateOne({
    _id: new ObjectID("5dce741ea8fd0c48982a1d7f")
  }, {
    /*
    update upper line's objectId's name property to Alicia
    $set: {
      name: 'Alicia'
    }

    Increment age by 1
    $inc: {
      age: 1
    }
  }).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  })
  */
  })

  // in tasks DB set every completed boolean value to true if it was false before 
  db.collection('tasks').updateMany({
    'completed': false
  }, {
    $set: {
      completed: true
    }
  })
    .then(result => console.log(result))
    .catch(error => console.log(error));
});