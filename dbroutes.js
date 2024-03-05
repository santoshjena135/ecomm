const express = require("express");
const multer = require('multer');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // /uploads directory needs to be present before any file uploads
  },
  filename: function(req, file, cb) {
    // Generate a unique name for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Get the file extension
    const ext = path.extname(file.originalname);
    // Set the filename to be unique and keep the original file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

const PORT = 4000;
app.use(bodyParser.json());
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
      if(product && product.length!=0){
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

app.post("/addProduct", upload.single('image'), (req, res) => {
  const formProduct = req.body;
  const imageFilepath = req.file.path;
  const productJSON = {
    "id": parseInt(formProduct.id),
    "title": formProduct.title,
    "price": parseFloat(formProduct.price),
    "description": formProduct.description,
    "category": formProduct.category,
    "image": "/"+imageFilepath,
    "rating": {
                "rate": parseFloat(formProduct.rate),
                "count": parseInt(formProduct.count)
    }

  };
  console.log("Inserting Product JSON",productJSON);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db("ecomm"); 
      const collection = database.collection("products");
      const result = await collection.insertOne(productJSON);
      
      console.log("Insertion result:", result);
      console.log(`${result.insertedCount} document inserted into DB`);
      if(result.acknowledged){
        return res.status(200).json([{"message":"insert success"}]);
      }
      else{
        return res.status(500).send("Error adding product!");
      }
    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }
  run().catch(console.error);
});


app.listen(PORT, () => console.log(`DB-Routes service running on port ${PORT} 🔥`));