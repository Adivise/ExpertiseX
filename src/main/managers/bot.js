import { fork } from 'child_process';
import { join } from 'path';
import fs from 'fs';
import { writeLog } from '../utils/index.js';

let botProcesses = new Map();

export const botManager = {
  startBot: (token, port, userId) => {
    const backendPath = join(__dirname, '../../out/backend/index.js');
    const botProcess = fork(backendPath, [token, port], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    botProcesses.set(userId, botProcess);

    if (userId) {
      fs.writeFileSync(join(process.cwd(), userId + '.log'), "");
    }

    if (botProcess.stdout) {
      botProcess.stdout.on("data", (data) => writeLog(`[🟢] ${data.toString()}`, userId));
    }

    if (botProcess.stderr) {
      botProcess.stderr.on("data", (data) => writeLog(`[❌] ${data.toString()}`, userId));
    }

    botProcess.on("close", (code) => {
      writeLog(`[🛑] ${code}`, userId);
      botProcesses.delete(userId);
    });
    
    botProcess.on("error", (err) => {
      writeLog(`[❌] ${err}`, userId);
      botProcesses.delete(userId);
    });
  },

  stopBot: (userId) => {
    const botProcess = botProcesses.get(userId);
    if (botProcess) {
      botProcess.kill();
      botProcesses.delete(userId);
    }
  },

  getActiveBots: () => Array.from(botProcesses.keys())
}; 