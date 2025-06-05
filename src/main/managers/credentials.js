import fs from 'fs';
import { PATHS } from '../constants/paths.js';

export const credentialsManager = {
  saveCredential: async (token, username, id, avatar) => {
    let credentials = [];
    try {
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const fileContent = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        if (fileContent?.trim()) {
          credentials = JSON.parse(fileContent);
          if (!Array.isArray(credentials)) credentials = [];
        }
      }
    } catch (err) {
      console.error("Error reading credentials file:", err);
    }

    const index = credentials.findIndex((cred) => cred.id === id);
    const newCredential = { token, username, id, avatar };
    
    if (index === -1) {
      credentials.push(newCredential);
    } else {
      credentials[index] = newCredential;
    }

    fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials, null, 2), "utf-8");
  },

  getCredentials: () => {
    try {
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const data = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading credentials:", error);
    }
    return null;
  },

  deleteCredential: (token) => {
    try {
      let credentials = [];
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const fileContent = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        credentials = JSON.parse(fileContent);
        if (!Array.isArray(credentials)) credentials = [];
      }
      credentials = credentials.filter(cred => cred.token !== token);
      fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials), "utf-8");
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  }
}; 