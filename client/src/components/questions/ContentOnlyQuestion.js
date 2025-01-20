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
  section: {
    marginBottom: "15px",
  },
  heading: {
    margin: "10px 0 5px 0",
  },
  metadata: {
    fontSize: "0.9em",
    color: "#666",
    marginTop: "10px",
  },
};

function ContentOnlyQuestion({ question }) {
  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>Learning Content:</h4>
      <div style={styles.content}>
        {/* Assuming content is stored in blocks */}
        {question.getBlocksList().map((block, index) => (
          <div key={index} style={styles.section}>
            <div>{block.getText()}</div>
            {block.getMetadata && (
              <div style={styles.metadata}>
                {/* Add any metadata rendering here */}
                {block.getMetadata()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentOnlyQuestion;
