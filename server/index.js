import startServer from "./config/gRPC.js";
import connectDB from "./config/mongodb.js";

startServer();

connectDB();
