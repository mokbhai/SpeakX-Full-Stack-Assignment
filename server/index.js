import startGrpcServer from "./config/gRPC.js";
import connectDB from "./config/mongodb.js";
import grpcMethods from "./methods/index.js";

// Start gRPC server
startGrpcServer(grpcMethods);

// Connect to DB
connectDB();
