import React, { useState } from "react";
import { QuestionsService as QuestionsClient } from "./grpc/client";

function TestConnection() {
  const [numbers, setNumbers] = useState({ a: 0, b: 0 });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await QuestionsClient.add(numbers.a, numbers.b);
      setResult(response.getResult());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>gRPC Calculator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={numbers.a}
          onChange={(e) =>
            setNumbers({ ...numbers, a: parseInt(e.target.value) })
          }
          placeholder="First number"
        />
        <input
          type="number"
          value={numbers.b}
          onChange={(e) =>
            setNumbers({ ...numbers, b: parseInt(e.target.value) })
          }
          placeholder="Second number"
        />
        <button type="submit">Add</button>
      </form>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}

export default TestConnection;
