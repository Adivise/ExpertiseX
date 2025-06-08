import crypto from 'crypto';
import { PATHS } from '../constants/paths.js';
import fs from 'fs';

// Generate a secure encryption key if not exists
const getEncryptionKey = () => {
  const keyPath = PATHS.ENCRYPTION_KEY;
  if (!fs.existsSync(keyPath)) {
    const key = crypto.randomBytes(32);
    fs.writeFileSync(keyPath, key);
    return key;
  }
  return fs.readFileSync(keyPath);
};

// Encrypt a string using AES-256-GCM
export const encrypt = (text) => {
  if (!text) return '';
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(12);
    
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    const result = Buffer.concat([iv, encrypted, authTag]);
    return result.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

// Decrypt a string using AES-256-GCM
export const decrypt = (encryptedText) => {
  if (!encryptedText) return '';
  try {
    const key = getEncryptionKey();
    const encryptedData = Buffer.from(encryptedText, 'base64');
    
    if (encryptedData.length < 28) { // IV(12) + AuthTag(16) minimum
      return '';
    }
    
    const iv = encryptedData.subarray(0, 12);
    const authTag = encryptedData.subarray(-16);
    const encrypted = encryptedData.subarray(12, -16);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}; 