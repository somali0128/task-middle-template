//IMPORTS
require("dotenv").config();
const axios = require("axios");
const { Web3Storage } = require("web3.storage");

const WEB3_GET_STORAGE_KEYS = [];

let storageClients = [];

WEB3_GET_STORAGE_KEYS.forEach((token, index) => {
  storageClients.push(new Web3Storage({ token }));
});

module.exports = async (cid) => {
  // Check if CID is provided
  if (!cid) throw new Error("CID is required");

  // Randomly select a client from the storageClients array
  const selectedClient =
    storageClients[Math.floor(Math.random() * storageClients.length)];

  // Fetch file metadata from the selected Web3 storage
  const res = await selectedClient.get(cid);

  if (!res.ok) return false;

  // Get file info
  const file = await res.files();

  const url = `https://${file[0].cid}.ipfs.w3s.link/?filename=${file[0].name}`;

  /* 
  const txtResponse = await axios.get(url_txt);
  const txtContent = txtResponse.data; */

  try {
    // Fetch file content
    const output = await axios.get(url);
    output.data.cid = cid;

    /*     const dataToFetch = `https://${cid}.ipfs.w3s.link/data.txt`; */

    /*     try {
      const response = await axios.get(dataToFetch);
      const content = response.data;
      output.data.pagedata = content;
    } catch (error) {
      console.error("Error fetching content:", error);
    } */

    return output;
  } catch (error) {
    console.error("ERROR", error);
    throw error; // Re-throw error to handle it in a higher-level function if needed
  }
};
