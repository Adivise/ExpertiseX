import { useState, useEffect } from "react";

const Console = () => {
  const [botLogs, setBotLogs] = useState("Loading logs...");

    useEffect(() => {
        async function fetchLogs() {
            const logs = await window.electronAPI.getBotLogs();
            setBotLogs(logs);
        }

        fetchLogs();
    }, []);

  return (
    <div className="content">
        <div className="markdown-container">
            <h2>Bot Console</h2>
            <pre style={{
              whiteSpace: "pre-wrap", // Allows the text to wrap
              wordWrap: "break-word", // Breaks words if needed
              overflowX: "auto" // Enables horizontal scrolling if necessary
            }}>
            {botLogs}
          </pre>
        </div>
    </div>
  );
};

export default Console;