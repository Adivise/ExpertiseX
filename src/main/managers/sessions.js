import fs from 'fs';
import { PATHS } from '../constants/paths.js';

export const sessionsManager = {
    saveSessionData: (userId, { guildId, voiceId }) => {
        try {
            let voiceData = {};
            
            // Read existing voice data if file exists
            if (fs.existsSync(PATHS.SESSION_DATA)) {
                const fileContent = fs.readFileSync(PATHS.SESSION_DATA, 'utf-8');
                if (fileContent?.trim()) {
                    voiceData = JSON.parse(fileContent);
                }
            }

            // Only save guildId and voiceId
            voiceData[userId] = {
                guildId: guildId || null,
                voiceId: voiceId || null,
                lastUpdated: new Date().toISOString()
            };

            // Save to file
            fs.writeFileSync(PATHS.SESSION_DATA, JSON.stringify(voiceData, null, 2), 'utf-8');
            return true;
        } catch (error) {
            console.error('Error saving voice data:', error);
            return false;
        }
    },

    getSessionData: (userId) => {
        try {
            if (fs.existsSync(PATHS.SESSION_DATA)) {
                const fileContent = fs.readFileSync(PATHS.SESSION_DATA, 'utf-8');
                if (fileContent?.trim()) {
                    const voiceData = JSON.parse(fileContent);
                    return voiceData[userId] || null;
                }
            }
            return null;
        } catch (error) {
            console.error('Error reading voice data:', error);
            return null;
        }
    }
}; 