import { openDB } from 'idb';
import Storage from './storage';
import { IDB } from '../typings';

async function initDB() {
  const db = await openDB<IDB>("english_assistant", 1, {
    upgrade(db) {
      db.createObjectStore("group", {
        keyPath: 'id',
        autoIncrement: true
      });

      const articleStore = db.createObjectStore("article", {
        keyPath: 'id',
        autoIncrement: true
      });
      articleStore.createIndex('groupID', 'groupID');
    },
    terminated() {
      // database error to close
      throw new Error("Database error.");
    }
  });

  const storage = new Storage(db);
  return storage;
}

export default initDB;