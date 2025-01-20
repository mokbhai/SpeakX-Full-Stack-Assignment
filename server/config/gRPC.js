import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.resolve("/proto/questions.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the package definition
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const questionsProto = protoDescriptor.Questions;

// Create gRPC server
function startGrpcServer(grpcMethods) {
  const server = new grpc.Server();
  server.addService(questionsProto.Questions.service, {
    ...grpcMethods,
  });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Server running at http://0.0.0.0:${port}`);
    }
  );
}

export default startGrpcServer;
