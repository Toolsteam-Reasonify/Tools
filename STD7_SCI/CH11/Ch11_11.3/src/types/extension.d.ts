// Type declarations for browser extension APIs to prevent TypeScript errors
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        lastError?: { message?: string };
        sendMessage?: (...args: any[]) => any;
        connect?: (...args: any[]) => any;
        sendNativeMessage?: (...args: any[]) => any;
      };
    };
    browser?: {
      runtime?: {
        sendMessage?: (...args: any[]) => any;
        connect?: (...args: any[]) => any;
      };
    };
  }
}

export {};

