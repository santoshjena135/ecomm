const express = require("express");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const bodyParser = require("body-parser");
const app = express();

const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.kedgoiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};
const dataBasePointer = process.env.DATABASE_NAME;

//AWS Confs
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});
const s3 = new AWS.S3();

//to get all products
app.get("/products", (req, res) => {
  const client = new MongoClient(uri,clientOptions);
    async function run() {
      try {
        await client.connect();
        console.log("Connected to MongoDB!");
  
        const database = client.db(dataBasePointer); 
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
  const client = new MongoClient(uri,clientOptions);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
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

//to get products by category
app.get("/category/:category", (req, res) => {
  const category = req.params.category;
  const client = new MongoClient(uri,clientOptions);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
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

//to get all/active/inactive categories
app.get("/categories/:type", (req, res) => {
  const type = req.params.type;
  const client = new MongoClient(uri,clientOptions);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
      const collection = database.collection("categories");
      
      const formatCategory = (category) => ({
          categoryName: category.categoryName,
          displayName: category.displayName
      });
      const categories = await collection.find({}).toArray();

      const allCategoryNames = categories.map(formatCategory);
      const activeCategoryNames = categories.filter(category => category.active).map(formatCategory);
      const inactiveCategoryNames = categories.filter(category => !category.active).map(formatCategory);
      if(categories){
        console.log("All_Categories_Details: ",categories);
        if(type === "active"){
          return res.send(activeCategoryNames);
        }
        else if(type === "inactive"){
          return res.send(inactiveCategoryNames)
        }
        else if(type === "all"){
          return res.send(allCategoryNames);
        }
        else{
          return res.send("Bad Parameter!")
        }
      }
      else{
        return res.status(404).send("No Categories in MongoDB");
      }

    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }

  run().catch(console.error);
});

//to get products by search term
app.get("/search/:searchTerm", (req, res) => {
  const searchTerm = req.params.searchTerm;
  const regexPattern = new RegExp("\\b" + searchTerm + "\\b", 'i');
  const client = new MongoClient(uri,clientOptions);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
      const collection = database.collection("products");
      
      const product = await collection.find({
        $or: [
          { title: { $regex: regexPattern } },
          { description: { $regex: regexPattern } }
        ]
      }).toArray();

      if(product && product.length!=0){
        console.log("Search_Product_Details: ",product);
        return res.send(product);
      }
      else{
        return res.status(404).send("Products with searchTerm -> "+searchTerm+" not found in MongoDB");
      }

    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }

  run().catch(console.error);
});

app.post("/addProduct", upload.single('image'), (req, res) => {
  const file = req.file;
  const bucketName = process.env.S3_BUCKET_NAME;
  const params = {
    Bucket: bucketName,
    Key: 'assets/'+(Date.now() + '-' + Math.round(Math.random() * 1E9))+'-'+file.originalname,
    Body: file.buffer,
    ContentType: 'image/' + file.originalname.split('.').pop()
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading file:", err);
      res.status(500).send("Error uploading file to S3");
    } else {
      console.log("File uploaded successfully to S3, File location:-", data.Location);
      console.log("---------------SAVING PRODUCT DETAILS TO MONGO ------------------");
      const formProduct = req.body;
      const productJSON = {
        "id": parseInt(formProduct.id),
        "title": formProduct.title,
        "price": parseFloat(formProduct.price),
        "description": formProduct.description,
        "category": formProduct.category,
        "image": data.Location,
        "rating": {
                    "rate": parseFloat(formProduct.rate),
                    "count": parseInt(formProduct.count)
          }
        };
        const client = new MongoClient(uri,clientOptions);
        async function run() {
          try {
            await client.connect();
            console.log("Connected to MongoDB!");

            const database = client.db(dataBasePointer); 
            const collection = database.collection("products");
            const result = await collection.insertOne(productJSON);
            
            console.log("Insertion result:", result);
            console.log(`${result.insertedCount} document inserted into DB`);
            console.log("---------------SAVED PRODUCT DETAILS TO MONGO ------------------");
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
    }
  });
});

app.post("/addCategory", (req, res) => {
  const formProduct = req.body;
  const client = new MongoClient(uri,clientOptions);
  const categoryJSON = {
    "id": parseInt(formProduct.id),
    "categoryName": formProduct.categoryName,
    "displayName": formProduct.displayName,
    "active": formProduct.active
  };
  console.log("Inserting Product JSON",categoryJSON);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
      const collection = database.collection("categories");

      const checkExisting = await collection.findOne({'categoryName':categoryJSON.categoryName});
      console.log("checkExisting",checkExisting);
      if(checkExisting){
        return res.json([{"message":"CategoryName already exists!"}]);
      }
      else{
        const result = await collection.insertOne(categoryJSON);
        console.log("Insertion result:", result);
        console.log(`${result.insertedCount} document inserted into DB`);
        if(result.acknowledged){
          return res.status(200).json([{"message":"insert success"}]);
        }
        else{
          return res.status(500).send("Error adding product!");
        }
    }
    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }
  run().catch(console.error);
});

//to get sitebanner
app.get("/sitebanner", (req, res) => {
  const client = new MongoClient(uri,clientOptions);
    async function run() {
      try {
        await client.connect();
        console.log("Connected to MongoDB!");
  
        const database = client.db(dataBasePointer); 
        const collection = database.collection("sitebanner");
        
        const sitebanner = await collection.find({}).toArray();
        if(sitebanner){
          console.log("Sitebanner_Details: ",sitebanner);
          return res.send(sitebanner);
        }
        else{
          return res.status(404).send("Sitebanner not found in Mongo/is inactive!");
        }
  
      } finally {
        await client.close();
        console.log("MongoDB connection closed.");
      }
    }
  
    run().catch(console.error);
  });

//update sitebanner
app.post("/sitebanner", (req, res) => {
  const formBanner = req.body;
  const client = new MongoClient(uri,clientOptions);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
      const collection = database.collection("sitebanner");

      const result = await collection.updateOne(
          { }, // updates all docs
          { $set: { customStyle: formBanner.customStyle,
                     bannerMessage: formBanner.bannerMessage,
                      isActive: formBanner.isActive } }
      );
        console.log("Insertion result:", result);
        console.log(`${result.insertedCount} document updated into DB`);
        if(result.acknowledged){
          return res.status(200).json([{"message":"insert success"}]);
        }
        else{
          return res.status(500).send("Error updating banner!");
        }
  
    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }
  run().catch(console.error);
});

app.post("/saveorder", (req, res) => {
  const body = req.body;
  const user_id = req.cookies.user_id;
  const client = new MongoClient(uri,clientOptions);
  const orderJSON = {
    "user_id": user_id,
    "cart_items": body.cart_items,
    "amount": parseFloat(body.cart_amount),
    "razorpay_payment_id": body.razorpay_payment_id,
    "razorpay_order_id": body.razorpay_order_id,
    "razorpay_signature": body.razorpay_signature,
    "status": "confirmed",
    "order_timestamp": body.order_timestamp
  };
  console.log("Inserting Order JSON", orderJSON);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
      const collection = database.collection("orders");

      const result = await collection.insertOne(orderJSON);
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

//get orders by user_id in cookies
app.get("/orders", (req, res) => {
  const user_id = req.cookies.user_id;
  const client = new MongoClient(uri,clientOptions);
  async function run() {
    try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db(dataBasePointer); 
      const collection = database.collection("orders");
      
      const orders = await collection.find({ user_id: String(user_id) }).sort({ order_timestamp: -1 }).toArray();
      if(orders && orders.length!=0){
        //console.log("Order_Details: ",orders);
        return res.send(orders);
      }
      else{
        return res.status(404).send("Orders with user_id -> "+user_id+" not found in MongoDB");
      }

    } finally {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }

  run().catch(console.error);
});

app.listen(PORT, () => console.log(`DB-Routes service running on port ${PORT} 🔥`));