const { Queue } = require("async-await-queue");
const sendData = require("./api/sendData");
const dataFromCid = require("./helpers/dataFromCid");

const BATCH_SIZE = 10;

async function queuePost(dataList, i) {
  // Create a queue with a concurrency of 5
  const postQ = new Queue(5, 100);
  let count = [];

  // Set to keep track of sent data URLs
  let sentDataUrls = new Set();

  // Iterate through the dataList and send each data
  for (let data of dataList) {
    if (sentDataUrls.has(data.url)) {
      // This data is a duplicate, skip it
      console.log("Duplicate data detected, skipping.");
      continue;
    }

    count.push(
      postQ.run(() =>
        sendData(data, i++).catch((e) => {
          console.error(e);
          // If sending fails, remove from the sent datas set so it can be retried later
          sentDataUrls.delete(data.url);
        })
      )
    );

    // Add the data's URL to the sent datas set
    sentDataUrls.add(data.url);
  }
  await Promise.all(count);
  return true;
}

async function queueCID(submissionList) {
  // Helper function to process items in a queue
  async function processInQueue(queue, items, processFunc) {
    let iterationNumber = 0;
    let promises = [];
    /*     console.log(items); */
    for (let item of items) {
      promises.push(
        queue.run(async () => {
          try {
            iterationNumber++;
            console.log(iterationNumber, "out of", items.length);
            return await processFunc(item);
          } catch (e) {
            console.error(e);
            return null; // Return null if an error occurs
          }
        })
      );
    }
    return Promise.all(promises);
  }

  console.log("Extracting submission data...");
  console.log("Latest round has", submissionList.length, "submissions.");

  const submissionQ = new Queue(5, 100);
  const submissionDataRawList = await processInQueue(
    submissionQ,
    submissionList,
    readSubmission
  );
  const cidDataRawList = submissionDataRawList.filter(Boolean).flat();

  console.log(`Data wait to be extracted and POST: ${cidDataRawList.length}`);
  console.log("Extracting data");

  const cidQ = new Queue(40, 30);

  const dataList = await processInQueue(cidQ, cidDataRawList, readCID);

  // Filter out any null values (from errors) and flatten the list if needed
  const flatDataList = dataList.filter(Boolean).flat();

  return flatDataList;
}

async function readCID(data) {
  // console.log(data);
  let dataDataRaw = await dataFromCid(data.cid);
  return dataDataRaw.data;
}

async function readSubmission(submission) {
  // console.log(submission);
  let submissionDataRaw = await dataFromCid(submission);
  return submissionDataRaw.data;
}

module.exports = { queuePost, queueCID };
