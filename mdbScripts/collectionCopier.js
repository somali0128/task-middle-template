const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../.env" });

const uri = process.env.DB_KEY;
const client = new MongoClient(uri, {});

async function copyCollection() {
  try {
    await client.connect();

    const db = client.db("DB_NAME");

    // Fetch all documents from the Datas collection
    const datas = await db.collection("Datas_2").find().toArray();

    // If the Datas_2 collection doesn't exist, it will be created automatically
    await db.collection("Datas").insertMany(datas);

    console.log("Collection copied successfully!");
  } catch (error) {
    console.error("Error copying collection:", error);
  } finally {
    await client.close();
  }
}

copyCollection();
