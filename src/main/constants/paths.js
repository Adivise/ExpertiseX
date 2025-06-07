import { join } from 'path';

export const PATHS = {
  CREDENTIALS: join(process.cwd(), "credentials.json"),
  CONFIG: join(process.cwd(), "config.json"),
  SESSION_DATA: join(process.cwd(), "session-data.json")
}; 