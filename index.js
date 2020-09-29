const express = require('express')
const app = express()
const port = 5000


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabianUser:arabianUser2020@cluster0.efifc.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(
    uri,
    { useUnifiedTopology: true }, 
    { useNewUrlParser: true });
client.connect(err => {
    const bookingsCollection = client.db("burjAlArab").collection("bookings");
    // perform actions on the collection object
    console.log('ok')





    client.close();
});








app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)