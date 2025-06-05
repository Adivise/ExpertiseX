import fs from 'fs';
import https from 'https';
import { PATHS } from '../constants/paths.js';

export const ffmpegManager = {
  checkFFmpeg: () => fs.existsSync(PATHS.FFMPEG),

  downloadFFmpeg: async () => {
    const initialUrl = "https://github.com/Adivise/ExpertiseX/releases/download/v2.0.0/ffmpeg.exe";
    
    const downloadFile = (url) => {
      return new Promise((resolve, reject) => {
        https.get(url, (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            return resolve(downloadFile(response.headers.location));
          }
          
          if (response.statusCode !== 200) {
            return reject(new Error(`Failed to download ffmpeg.exe. Status code: ${response.statusCode}`));
          }

          const fileStream = fs.createWriteStream(PATHS.FFMPEG);
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            resolve(true);
          });
        }).on("error", (err) => {
          fs.unlink(PATHS.FFMPEG, () => reject(err));
        });
      });
    };

    return downloadFile(initialUrl);
  }
}; 