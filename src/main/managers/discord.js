import { Client } from 'discord.js-selfbot-v13';
import { credentialsManager } from './credentials.js';

export const discordClient = {
  isValidToken: async (token, shouldSave) => {
    const client = new Client();
    try {
      await client.login(token);
      const username = client.user?.username || "";
      const id = client.user?.id || "";
      const avatar = client.user?.avatarURL() || "";
      
      if (shouldSave) {
        await credentialsManager.saveCredential(token, username, id, avatar);
      }
      
      return { valid: true, username: username, id: id, avatar: avatar };
    } catch (err) {
      console.error("Invalid token:", err);
      return { valid: false };
    } finally {
      client.destroy();
    }
  }
}; 