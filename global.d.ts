export {};
declare global {
  interface Window {
    electronAPI: {
      onWindowClose: (callback: (event: any) => void) => void;
      startBot: (token: string, port: string) => void;
      getBotLogs: () => Promise<string>;
      checkToken: (token: string) => Promise<boolean>;
      getEnv: () => Promise<{ ip: string }>; // ✅ Updated return type
      checkPort: (port: number) => Promise<boolean>; // ✅ Ensure port is a number, not a string
      removeListener: (channel: string, callback: (...args: any[]) => void) => void; // ✅ Allows removing event listeners safely
    };
  }
}