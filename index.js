const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const admin = require('firebase-admin');

const port = 5000

app.use(cors());
app.use(bodyParser.json());

const serviceAccount = require("./burj-al-arab2020-firebase-adminsdk-kfiqa-7ff9c1bce9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://burj-al-arab2020.firebaseio.com"
});


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabianUser:arabianUser2020@cluster0.efifc.mongodb.net/<dbname>?retryWrites=true&w=majority";
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
                                res.statusCode(200).send(documents);
                            })
                    }
                    else {
                        res.statusCode(401).send('Unauthorized access');
                    }
                }).catch((error) => {
                    res.statusCode(401).send('Unauthorized access')
                });
        } else {
            res.statusCode(401).send('Unauthorized access');
        }
    })


    // client.close();
});








app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)