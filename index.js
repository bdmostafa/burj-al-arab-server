const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efifc.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const port = 5000

app.use(cors());
app.use(bodyParser.json());

const serviceAccount = require("./configs/burj-al-arab2020-firebase-adminsdk-kfiqa-7ff9c1bce9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIRE_DB
});

const client = new MongoClient(
    uri,
    { useUnifiedTopology: true },
    { useNewUrlParser: true });
client.connect(err => {
    const bookingsCollection = client.db("burjAlArab").collection("bookings");

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookingsCollection.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/bookings', (req, res) => {
        // console.log(req.query.email);
        // console.log(req.headers.authorization);

        const bearer = req.headers.authorization
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            // console.log(idToken);
            // idToken comes from the client app
            admin.auth().verifyIdToken(idToken)
                .then((decodedToken) => {
                    // const uid = decodedToken.uid;
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email
                    // console.log(tokenEmail, queryEmail)
                    if (tokenEmail == req.query.email) {
                        bookingsCollection.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.status(200).send(documents);
                            })
                    }
                    else {
                        res.status(401).send('Unauthorized access');
                    }
                }).catch((error) => {
                    res.status(401).send('Unauthorized access')
                });
        } else {
            res.status(401).send('Unauthorized access');
        }
    })
    // client.close();
});








app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)