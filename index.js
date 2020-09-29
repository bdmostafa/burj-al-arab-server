const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port = 5000

app.use(cors());
app.use(bodyParser.json());


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
        console.log(req.query.email);
        bookingsCollection.find({
            email: req.query.email
        })
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


    // client.close();
});








app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)