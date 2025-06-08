import fs from 'fs';
import { PATHS } from '../constants/paths.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const credentialsManager = {
  saveCredential: async (token, username, id, avatar) => {
    let credentials = [];
    try {
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const fileContent = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        if (fileContent?.trim()) {
          try {
            credentials = JSON.parse(fileContent);
            if (!Array.isArray(credentials)) credentials = [];
          } catch (e) {
            console.error("Error parsing credentials file:", e);
            credentials = [];
          }
        }
      }
    } catch (err) {
      console.error("Error reading credentials file:", err);
    }

    const index = credentials.findIndex((cred) => cred.id === id);
    const newCredential = { 
      token: encrypt(token),
      username, 
      id, 
      avatar 
    };
    
    if (index === -1) {
      credentials.push(newCredential);
    } else {
      credentials[index] = newCredential;
    }

    try {
      fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing credentials file:", err);
    }
  },

  getCredentials: () => {
    try {
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const data = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        if (!data?.trim()) return [];
        
        try {
          const credentials = JSON.parse(data);
          if (!Array.isArray(credentials)) return [];
          
          return credentials.map(cred => ({
            ...cred,
            token: decrypt(cred.token)
          }));
        } catch (e) {
          console.error("Error parsing credentials:", e);
          return [];
        }
      }
    } catch (error) {
      console.error("Error reading credentials:", error);
    }
    return [];
  },

  deleteCredential: (token) => {
    try {
      let credentials = [];
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const fileContent = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        if (fileContent?.trim()) {
          try {
            credentials = JSON.parse(fileContent);
            if (!Array.isArray(credentials)) credentials = [];
          } catch (e) {
            console.error("Error parsing credentials file:", e);
            credentials = [];
          }
        }
      }
      credentials = credentials.filter(cred => decrypt(cred.token) !== token);
      fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials, null, 2), "utf-8");
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  }
}; 