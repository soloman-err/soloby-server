const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 2000;

// middleware:
app.use(cors());
app.use(express.json());

// mongodb:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wndd9z6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server:

    const carCollection = client.db("solobyDB").collection("cars");

    // Fetch all data:
    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Fetch specific users data:
    app.get("/myToys", async (req, res) => {
      console.log(req.query);

      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }

      // const { email } = req.query;
      // const query = email ? { email } : {};
      const result = await carCollection.find(query).toArray();
      res.send(result);
    });

    // Fetch single toy data:
    app.get("/toyDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Included returned documents:
        projection: {
          productsTitle: 1,
          photoURL: 1,
          quantity: 1,
          name: 1,
          email: 1,
          price: 1,
          rating: 1,
          subCategory: 1,
          desc: 1,
        },
      };

      const result = await carCollection.findOne(query, options);
      res.send(result);
      console.log(result);
    });

    // Add a new car to the collection:
    app.post("/addAToy", async (req, res) => {
      const addedToy = req.body;
      console.log(addedToy);
      const result = await carCollection.insertOne(addedToy);
      res.send(result);
    });

    // Delete specific data:
    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection:
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("soloby on-air!");
});

app.listen(port, () => {
  console.log(`soloby is listening on port: ${port}`);
});
