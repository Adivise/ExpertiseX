import { useState, useEffect } from "react";

const Console = () => {
  const [botLogs, setBotLogs] = useState("Loading logs...");

  useEffect(() => {
    // Create an interval that polls for logs every second (1000 ms)
    const intervalId = setInterval(async () => {
      try {
        const logs = await window.electronAPI.getBotLogs();
        setBotLogs(logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }, 1000); // adjust the interval as needed

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="content">
      <div className="markdown-container">
        <h2>Bot Console</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap", // Allows the text to wrap
            wordWrap: "break-word", // Breaks words if needed
            overflowX: "auto" // Enables horizontal scrolling if necessary
          }}
        >
          {botLogs}
        </pre>
      </div>
    </div>
  );
};

export default Console;