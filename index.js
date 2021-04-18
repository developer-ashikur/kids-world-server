const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT || 4000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oeq97.mongodb.net/kidsWorld?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello Kids World!')
});

client.connect(err => {
    const serviceCollection = client.db("kidsWorld").collection("services");
    const usersCollection = client.db("kidsWorld").collection("users");
    const reviewCollection = client.db("kidsWorld").collection("reviews");
    const adminCollection = client.db("kidsWorld").collection("admins");

    app.post('/addService', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
      });

      app.get('/services', (req, res) => {
        serviceCollection.find({})
          .toArray((err, document) => {
            res.send(document);
          })
      });

      app.get('/service/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
          .toArray((err, document) => {
            res.send(document[0]);
          })
      });

      app.post('/addBooking', (req, res) => {
        const user = req.body;
        usersCollection.insertOne(user)
          .then(result => {
            res.json(result.insertedCount > 0);
          })
      });

      app.get('/bookedServices', (req, res) => {
        usersCollection.find({ email: req.query.email })
          .toArray((err, document) => {
            res.json(document);
          })
      });

      app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
          .then(result => {
            res.json(result.insertedCount > 0);
          })
      });

      app.get('/reviews', (req, res) => {
        reviewCollection.find({})
          .toArray((err, document) => {
            res.send(document);
          })
      });

      app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
          res.send(result.deletedCount > 0)
        })
      });

      app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
          .then(result => {
            res.json(result.insertedCount > 0);
          })
      });

      app.post('/isAdmin', (req, res) => {
          const email = req.body.email;
          adminCollection.find({email: email})
          .toArray((err, admins) => {
              res.send(admins.length > 0)
          })
      });

      app.get('/users', (req, res) => {
        usersCollection.find({})
          .toArray((err, document) => {
            res.send(document);
          })
      });

      app.patch('/updateStatus/:id', (req, res) => {
        usersCollection.updateOne({_id: ObjectId(req.params.id)}, {
          $set: {status: req.body.status}
        })
        .then(result => {
          res.send(result.modifiedCount > 0)
        })
      });
  });

  app.listen(port);