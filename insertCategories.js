//run once for inserting all categories into DB

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

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const database = client.db("ecomm");
    const collection = database.collection("categories");

    // Inserting all categories in JSON format into the collection 'categories' under database 'ecomm'
    const allCategories = [
      {
        "id": 1,
        "categoryName": "electronics",
        "displayName": "Electronics",
        "active": true
      },
      {
        "id": 2,
        "categoryName": "jewelery",
        "displayName": "Jewellery",
        "active": true
      },
      {
        "id": 3,
        "categoryName": "men's clothing",
        "displayName": "Men",
        "active": true
      },
      {
        "id": 4,
        "categoryName": "women's clothing",
        "displayName": "Women",
        "active": true
      }
    ];

    // Inserting the document into the collection
    const categories = await collection.find({}).toArray();
    if(categories.length == 0) // insert only if 'categories' collection is empty!
    {
        const result = await collection.insertMany(allCategories);
        console.log("Insertion result:", result);
        console.log(`${result.insertedCount} document inserted into DB`);
    }
    else{
        console.log("Data already exists, Insertion ABORTED!")
    }
  } finally {
    // Ensures that the client will close - when you finish/on errors
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

run().catch(console.error);

