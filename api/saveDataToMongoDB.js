const { MongoClient } = require("mongodb");
const axios = require("axios");
require("dotenv").config({ path: "../.env" });
const DB_KEY = process.env.DB_KEY;

async function saveDataToMongoDB(dataList) {
  let localtl = dataList;
  const client = new MongoClient(DB_KEY);

  try {
    /*     const txtResponse = await axios.get(
      "https://bafybeigvqiiahfaiur2ckwnnnuqt2uhzmdjmjoymt4xgwuj6naniksgyli.ipfs.w3s.link/data.txt"
    );
    const txtContent = txtResponse.data;
    localtl.forEach((obj) => {
      obj.data = txtContent;
    }); */
    await client.connect();
    const db = client.db("DB_NAME");
    const collection = db.collection("DB_NAME_COLLECTION");
    try {
      const result = await collection.insertMany(localtl);
    } catch (error) {
      console.error(
        "Error occurred during insertMany operation. (Potentially, a duplicate key is rejected)"
      );
    }
    console.log("Data inserted.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

//Default Export
module.exports = saveDataToMongoDB;
