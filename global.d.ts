export {};
declare global {
  interface Window {
    electronAPI: {
      startBot: (token: string, port: string, userId: string, avatar: string) => void;
      stopBot: (userId: string) => Promise<void>;
      getActiveBots: () => Promise<string[]>;
      getBotLogs: (userId: string) => Promise<string>;
      checkToken: (token: string, shouldSave: boolean) => Promise<{ valid: boolean; username: string; id: string; avatar: string }>;
      getCredentials: () => Promise<Array<{ token: string; username: string; id: string; avatar: string }>>;
      checkPort: (port: number) => Promise<boolean>;
      removeListener: (channel: string, callback: (...args: any[]) => void) => void;
      deleteCredential: (token: string) => Promise<void>;
      loadConfig: () => Promise<Record<string, any> | null>;
      saveConfig: (config: Record<string, any>) => Promise<boolean>;
      checkConfig: () => Promise<boolean>;
      getVersion: () => string;
      windowMinimize: () => Promise<void>;
      windowMaximize: () => Promise<void>;
      windowClose: () => Promise<void>;
      saveSessionData: (userId: string, sessionData: Record<string, any>) => Promise<boolean>;
      getSessionData: (userId: string) => Promise<Record<string, any> | null>;
      checkFFmpeg: () => Promise<boolean>;
      downloadFFmpeg: () => Promise<void>;
    };
  }
}