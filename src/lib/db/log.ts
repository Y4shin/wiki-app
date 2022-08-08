import db from './db';

export const createNewLog = async (route: string, status: number, uid?: number) => {
  const log = await db.log.create({
    data: {
      uid,
      route,
      status
    }
  });
  return log;
}
export const addEntryToLog = async (lid: number, level: 'info' | 'warning' | 'error', message: string) => {
  const entry = await db.logEntry.create({
    data: {
      lid,
      level,
      message
    }
  });
  return entry;
}
export const finalizeLog = async (lid: number, status: number) => {
  const log = await db.log.update({
    where: {
      lid
    },
    data: {
      status
    }
  });
  return log;
}