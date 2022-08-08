export {}; 

declare global{
   namespace Express {
       interface Request {
           uid?: number,
           newLog?: (level: 'info' | 'warning' | 'error', message: string) => Promise<void>
       }
   }
}