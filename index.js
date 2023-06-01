const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// =================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufrxsge.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // data get from DB
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // get single data from db after delete/post/update
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    // make coffee collection in db
    const coffeeCollection = client.db('coffeeDb').collection('coffee');

    // add one item in server
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    // update specific id data
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          quantity: updatedCoffee.quantity,
          price: updatedCoffee.price,
          photoUrl: updatedCoffee.photoUrl
        }
      }
      const result = await coffeeCollection.updateOne(filter, options, coffee)
      res.send(result);
    })

    // delete item
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =================================

app.get('/', (req, res) => {
  res.send('Coffee making server is running')
})


app.listen(port, () => {
  console.log(`Coffee server is running on port : ${port}`)
})