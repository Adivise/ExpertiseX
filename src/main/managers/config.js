import fs from 'fs';
import { PATHS } from '../constants/paths.js';

export const configManager = {
  loadConfig: async () => {
    try {
      if (fs.existsSync(PATHS.CONFIG)) {
        const data = fs.readFileSync(PATHS.CONFIG, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error parsing config file:", error);
    }
    return null;
  },

  saveConfig: (config) => {
    try {
      fs.writeFileSync(PATHS.CONFIG, JSON.stringify(config, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error("Error saving config file:", error);
      return false;
    }
  },

  checkConfig: () => fs.existsSync(PATHS.CONFIG)
}; 