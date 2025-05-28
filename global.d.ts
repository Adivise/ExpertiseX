export {};
declare global {
  interface Window {
    electronAPI: {
      onWindowClose: (callback: (event: any) => void) => void;
      startBot: (token: string, port: string) => void;
      getBotLogs: () => Promise<string>;
      checkToken: (token: string) => Promise<boolean>;
      getEnv: () => Promise<{ ip: string }>;
      checkPort: (port: number) => Promise<boolean>;
      removeListener: (channel: string, callback: (...args: any[]) => void) => void;
      storeToken: (token: string) => Promise<void>;
      getToken: () => Promise<string>;
      checkFFmpeg: () => Promise<boolean>;
      downloadFFmpeg: () => Promise<void>;
    };
  }
}