import React from "react";

const styles = {
  container: {
    marginTop: "10px",
  },
  conversation: {
    background: "#F8FAFC",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #eee",
  },
  message: {
    marginBottom: "12px",
    padding: "10px 15px",
    borderRadius: "8px",
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#F47B20",
    color: "white",
    marginLeft: "auto",
    boxShadow: "0 2px 4px rgba(244,123,32,0.2)",
  },
  botMessage: {
    backgroundColor: "white",
    color: "#2D3748",
    border: "1px solid #eee",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  heading: {
    color: "#2D3748",
    margin: "15px 0 10px 0",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  speaker: {
    fontWeight: "500",
    marginBottom: "5px",
    color: "inherit",
  },
};

function ConversationQuestion({ question }) {
  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>Conversation:</h4>
      <div style={styles.conversation}>
        <div style={styles.messageContainer}>
          {question.getBlocksList().map((block, index) => {
            const isUser = block.getIsuser?.() || false; // Assuming there's an isUser field
            const messageStyle = {
              ...styles.message,
              ...(isUser ? styles.userMessage : styles.botMessage),
            };

            return (
              <div key={index} style={messageStyle}>
                <div style={styles.speaker}>
                  {isUser ? "User" : "Assistant"}:
                </div>
                <div>{block.getText()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ConversationQuestion;
