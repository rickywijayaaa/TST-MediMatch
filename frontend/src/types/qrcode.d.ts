declare module 'qrcode' {
    const toDataURL: (
      text: string,
      callback: (err: Error | null, url?: string) => void
    ) => void;
  
    export default {
      toDataURL,
    };
  }
  