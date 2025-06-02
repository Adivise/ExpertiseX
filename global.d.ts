export {};
declare global {
  interface Window {
    electronAPI: {
      onWindowClose: (callback: (event: any) => void) => void;
      startBot: (token: string, port: string) => void;
      getBotLogs: () => Promise<string>;
      checkToken: (token: string, shouldSave: boolean) => Promise<{ valid: boolean; username: string }>;
      checkPort: (port: number) => Promise<boolean>;
      removeListener: (channel: string, callback: (...args: any[]) => void) => void;
      getCredentials: () => Promise<Array<{ token: string; username: string }>>;
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