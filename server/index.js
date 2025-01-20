import startServer from "./config/gRPC.js";
import connectDB from "./config/mongodb.js";
import grpcMethods from "./methods/index.js";

startServer(grpcMethods);

connectDB();
