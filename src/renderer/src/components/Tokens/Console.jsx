import { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from "../../module/MDRender";

const Console = () => {
  const [botLogs, setBotLogs] = useState('');
  const consoleRef = useRef(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await window.electronAPI.getBotLogs();
        setBotLogs(logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [botLogs]);

  const markdownContent = `
You can see the bot console logs in here.
  `;

  return (
    <div className="content">
      <div className="markdown-container">
          <h2>Bot Console</h2>
          <MarkdownRenderer content={markdownContent} />
      </div>
      <div className="console-output" ref={consoleRef}>
        {botLogs.split('\n').map((line, index) => (
          <div key={index} className="log-entry">
            <span className="log-content">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Console;