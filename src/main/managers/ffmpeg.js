import fs from 'fs';
import https from 'https';
import { PATHS } from '../constants/paths.js';
import { exec } from 'child_process';

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

export const ffmpegManager = {
    // Checks if FFmpeg is available on the system.
checkFFmpeg: async () => {
    if (process.platform === 'win32') {
        return fs.existsSync(PATHS.FFMPEG);
    } else if (process.platform === 'linux' || process.platform === 'darwin') {
        try {
            await execPromise('which ffmpeg');
            return true;
        } catch (error) {
            return false;
        }
    } else {
        return false;
    }
},

  // Downloads or installs FFmpeg depending on the platform.
downloadFFmpeg: async () => {
    const initialUrl = "https://github.com/Adivise/ExpertiseX/releases/download/v2.0.0/ffmpeg.exe";

    const downloadFile = (url) => {
        return new Promise(async (resolve, reject) => {
            if (process.platform === 'win32') {
                https.get(url, (response) => {
                    // Handle redirects
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
            } else if (process.platform === 'linux') {
                await execPromise('sudo apt-get install -y ffmpeg');
                return true;
            } else if (process.platform === 'darwin') {
                await execPromise('brew install ffmpeg');
                return true;
            }
        });
    };
    return downloadFile(initialUrl);
    }
};