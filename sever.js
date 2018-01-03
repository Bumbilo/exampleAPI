const express = require('express');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const app = express();

var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var artistes = [
    { id: 1, name: 'Metalica' },
    { id: 2, name: 'Iron Maiden' },
    { id: 3, name: 'Deep Purple' }
];

app.get('/', (req, res) => {
    res.send('Hello API');
});

app.get('/artist', (req, res) => {
    db.collection('artist').find().toArray((err, docs) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(docs);
    });
})

app.get('/artist/:id', (req, res) => {
    db.collection('artist').findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            console.log(err)
            res.sendStatus(500);
        }
        res.send(doc)
    });
})

app.post('/artist', (req, res) => {
    const artist = {
        name: req.body.name
    };

    db.collection('artist').insert(artist, function (err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }

        res.send(artist);
    });
});

app.put('/artist/:id', (req, res) => {
    console.log(req.params)

    db.collection('artist').updateOne(

        { _id: ObjectID(req.params.id) },
        { name: req.body.name },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            res.sendStatus(200);
        }
    );

    res.sendStatus(200);
});

app.delete('/artist/:id', (req, res) => {
    artistes = artistes.filter(artist => artist.id !== Number(req.body.id));
    return res.sendStatus(200);
});

MongoClient.connect('mongodb://localhost:27017/myapi', (err, database) => {

    if (err) {
        console.log(err);
    }

    db = database.db('myTestBD');

    app.listen(3000, () => {
        console.log('API is Started !!!')
    })

});
