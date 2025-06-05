import fs from 'fs';
import { join } from 'path';
import net from 'net';

export const clearAllLogs = () => {
  try {
    const files = fs.readdirSync(process.cwd());
    files.forEach(file => {
      if (file.endsWith('.log')) {
        fs.writeFileSync(join(process.cwd(), file), '');
      }
    });
  } catch (err) {
    console.error("Error clearing logs:", err);
  }
};

export const writeLog = (message, userId) => {
  if (!userId) return;
  
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const logPath = join(process.cwd(), `${userId}.log`);
  fs.appendFileSync(logPath, `[${timestamp}] | ${message}`);
};

export const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") resolve(false);
      else resolve(true);
    });
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}; 