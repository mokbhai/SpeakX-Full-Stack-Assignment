import React from "react";

const styles = {
  container: {
    marginTop: "10px",
  },
  content: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "4px",
    lineHeight: "1.6",
  },
  paragraph: {
    marginBottom: "10px",
  },
  heading: {
    margin: "10px 0 5px 0",
  },
};

function ReadAlongQuestion({ question }) {
  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>Reading Content:</h4>
      <div style={styles.content}>
        {/* Assuming content is stored in blocks */}
        {question.getBlocksList().map((block, index) => (
          <p key={index} style={styles.paragraph}>
            {block.getText()}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ReadAlongQuestion;
