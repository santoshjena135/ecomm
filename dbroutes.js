const express = require("express");
const app = express();
const PORT = 4000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.kedgoiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//to get all products
app.get("/products", (req, res) => {
    async function run() {
      try {
        await client.connect();
        console.log("Connected to MongoDB!");
  
        const database = client.db("ecomm"); 
        const collection = database.collection("products");
        
        const products = await collection.find({}).toArray();
        if(products){
          console.log("All_Products_Details: ",products);
          return res.send(products);
        }
        else{
          return res.status(404).send("No Products in MongoDB");
        }
  
      } finally {
        await client.close();
        console.log("MongoDB connection closed.");
      }
    }
  
    run().catch(console.error);
  });

//to get product by id
app.get("/products/:id", (req, res) => {
  const prodid = req.params.id;
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db("ecomm"); 
      const collection = database.collection("products");
      
      const product = await collection.findOne({ id: Number(prodid) });
      if(product){
        console.log("Product_Details: ",product);
        return res.send(product);
      }
      else{
        return res.status(404).send("Product with id -> "+prodid+" not found in MongoDB");
      }

    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }

  run().catch(console.error);
});

app.get("/products/category/:category", (req, res) => {
  const category = req.params.category;
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db("ecomm"); 
      const collection = database.collection("products");
      
      const product = await collection.find({ category: String(category) }).sort({id:1}).toArray();
      if(product){
        console.log("Product_Details: ",product);
        return res.send(product);
      }
      else{
        return res.status(404).send("Product with category -> "+category+" not found in MongoDB");
      }

    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }

  run().catch(console.error);
});


app.listen(PORT, () => console.log(`DB-Routes service running on port ${PORT} 🔥`));