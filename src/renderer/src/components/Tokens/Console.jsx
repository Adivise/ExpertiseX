import { useState, useEffect } from "react";
import MarkdownRenderer from "../../module/MDRender";

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
            <MarkdownRenderer content={botLogs} />
        </div>
    </div>
  );
};

export default Console;