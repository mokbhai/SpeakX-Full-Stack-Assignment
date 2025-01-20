// Implement the Add RPC method
function add(call, callback) {
  const { a, b } = call.request;
  const result = a + b;
  callback(null, { result });
}

function multiply(call, callback) {
  const { a, b } = call.request;
  const result = a * b;
  callback(null, { result });
}

export default {
  add,
  multiply,
};