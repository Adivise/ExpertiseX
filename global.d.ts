export {};
declare global {
  interface Window {
    electronAPI: {
      onWindowClose: (callback: (event: any) => void) => void;
      startBot: (token: string, port: string, userId: string) => void;
      stopBot: (userId: string) => Promise<void>;
      getActiveBots: () => Promise<string[]>;
      getBotLogs: (userId: string) => Promise<string>;
      checkToken: (token: string, shouldSave: boolean) => Promise<{ valid: boolean; username: string; id: string }>;
      getCredentials: () => Promise<Array<{ token: string; username: string; id: string }>>;
      checkPort: (port: number) => Promise<boolean>;
      removeListener: (channel: string, callback: (...args: any[]) => void) => void;
      deleteCredential: (token: string) => Promise<void>;
      checkFFmpeg: () => Promise<boolean>;
      downloadFFmpeg: () => Promise<void>;
      loadConfig: () => Promise<Record<string, any> | null>;
      saveConfig: (config: Record<string, any>) => Promise<boolean>;
      checkConfig: () => Promise<boolean>;
      getVersion: () => string;
    };
  }
}