# Koii Task Middleman

This project aims to bridge the gap between the Koii Task Submissions and a standardized database.

![Task Middleman](https://i.imgur.com/JeNpHHO.png)

## Steps:

- Reads submissions from a Koii Task.
- Extracts the referred data from IPFS using a submission list.
- Stores the data in a MongoDB database.

It uses a queuing system to manage concurrency and ensure efficient processing.

## Structure

- **index.js**: Main entry point that orchestrates the fetching and posting processes.
- **queue.js**: Contains the logic for queuing the tasks, such as sending datas and handling CID data.

## Dependencies

- **async-await-queue**: For managing task concurrency.
- **axios**: For making HTTP requests.

## Usage

1. Install Dependencies
   Before running the project, make sure to install the required dependencies:

```bash
yarn
```

2. Configure Server and Tokens
   Ensure that the server URL and any required tokens or headers are properly configured in the sendData function inside the api directory. To extract the data from IPFS, you need to provide the `SECRET_WEB3_STORAGE_KEY` in .env file. To post the data to the server, you need to provide the `USER_TOKEN` in .env file.

3. Run the Project
   You can run the project by executing the following command:

```bash
npm run start
```

This will start the process of fetching datas and posting them to the configured server.

To test the project, you can use the following command:

```bash
npm run server
```

This will start a server that listen on localhost:3333 will receive the datas and log them to the console. Then in `api/sendData.js` file, change the server url to locahost:3333.

## Functions

- **queuePost(dataList, i)**
  - Parameters:
    - **dataList**: An array of data data.
    - **i**: An index used for tracking the process.
  - Description: Handles the queuing and sending of datas to the server.
- **queueCID(submissionList)**
  - Parameters:
    - **submissionList**: An array of submission data including CIDs.
  - Description: Extracts data data from IPFS using the provided CIDs.

## Note

Make sure that the server is configured to receive the data in the expected format and that all necessary headers, tokens, and timeouts are properly set.
