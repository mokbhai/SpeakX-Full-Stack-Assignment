# SpeakX Placement Assignment

Welcome to the **SpeakX Placement Assignment**! This project demonstrates the implementation of a server and frontend system using **gRPC**, **MongoDB**, and **Docker**. Follow the steps below to set up and run the project.

---

## Setup 2 ways

### Step 1. Configure the `.env` File (for both)

- Copy the `.env.example` file and rename it to `./server/.env`.
- Add your **MongoDB URI** to the `.env` file.  
  If you don’t have a custom URI, you can use the default URI provided in the `.env.example` file.

---

### Step 2. IF you want to run in one step then in docker-compose.yml file uncomment the client section and run the following command: (Efficent for pcs with high ram)

```bash
chmod +x ./run-container.sh ./proto-gen.sh && ./run-container.sh
```

---

### Step 2. Run the Project Using Docker-Compose

To simplify the setup, you can use Docker-Compose to run the project. Follow the steps below:

1. Run the following command to start the containers:
   ```bash
   chmod +x ./run-container.sh ./proto-gen.sh && ./run-container.sh
   ```
2. This will set up the server, and proxy automatically.

3. add url of proxy in client/src/grpc/client.js or you can use the default url `https://grpc-server.impressment.in/`
4. Start the client by running the following command:
   ```bash
   cd client
   npm start
   ```
   or build the client by running the following command:
   ```bash
   cd client
   npm run build
   npm install -g serve
   sudo npx serve -s build
   ```

For a detailed explanation of the Docker-Compose implementation, refer to [this guide](https://github.com/mokbhai/SiddhProject/blob/main/NodeJs/gRPC/client-to-server/README_Improved_By_ChatGPT.md).

---

### 3. Seed the Database

To seed the database with initial data:

1. Download the `speakx_questions.json` file from [this link](https://drive.google.com/file/d/1CZ0GX4opA4grkLunRuWwH7bwlmfcSeUQ/view).
2. Copy the file to the `server` folder.
3. Run the following commands:
   ```bash
   cd server
   npm run seed
   ```
4. This will populate the database with the required data for the project.

Additionally, you can view the analyzed data output here: [speakx_questions_analysis](https://github.com/mokbhai/speakx-search-questions/blob/main/server/seed/speakx_questions_analysis.json).

---

## Project Steps

The steps I followed to create this project are documented in the respective server and frontend folders.

- **Server Steps**: [View here](./server/README.md)
- **Client Steps**: [View here](./client/README.md)
- **Proto File Steps**: [View here](./proto/README.md)

---

## Key Features

### Server

- **gRPC Server**: The server uses gRPC for communication, with methods defined in `methods/index.js`.
- **MongoDB Integration**: The server connects to a MongoDB database using Mongoose.
- **Data Seeding**: Easily seed the database with initial data using the provided script.

### Client

- The client interacts with the server via gRPC, which provides a user-friendly interface for interacting with the system.

---

## Notes

- Ensure that Docker and Docker-Compose are installed on your system before running the project.
- If you encounter any issues with the MongoDB connection, double-check the **MongoDB URI** in the `.env` file.
- I have used AI in writing README files and for repeated tasks.
