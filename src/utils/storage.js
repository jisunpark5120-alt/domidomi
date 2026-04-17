import { openDB } from 'idb';

const DB_NAME = 'DomidomiDB';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('songs')) {
        const store = db.createObjectStore('songs', { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('sessions')) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' });
        store.createIndex('songId', 'songId');
        store.createIndex('createdAt', 'createdAt');
      }
    },
  });
}

export async function getSongs() {
  const db = await initDB();
  return db.getAllFromIndex('songs', 'createdAt');
}

export async function getSong(id) {
  const db = await initDB();
  return db.get('songs', id);
}

export async function saveSong(song) {
  const db = await initDB();
  await db.put('songs', {
    ...song,
    id: song.id || Date.now().toString(),
    createdAt: song.createdAt || Date.now()
  });
}

export async function deleteSong(id) {
  const db = await initDB();
  await db.delete('songs', id);
  // Also delete associated sessions
  const tx = db.transaction('sessions', 'readwrite');
  const index = tx.store.index('songId');
  let cursor = await index.openCursor(IDBKeyRange.only(id));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

export async function getSessionsForSong(songId) {
  const db = await initDB();
  const sessions = await db.getAllFromIndex('sessions', 'songId', songId);
  return sessions.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSession(id) {
  const db = await initDB();
  return db.get('sessions', id);
}

export async function addSession(session) {
  const db = await initDB();
  const newSession = {
    ...session,
    id: session.id || Date.now().toString(),
    createdAt: Date.now()
  };
  await db.put('sessions', newSession);
  return newSession;
}
