import { IDBPDatabase, openDB } from 'idb';
import { IWordsPanel, IDB } from '../typings';

class Storage {
  private db: IDBPDatabase<IDB>;

  constructor(_db: IDBPDatabase<IDB>) {
    this.db = _db;
  }

  public async addGroup(wordsGroup: IWordsPanel) {
    return await this.db.add('group', {
      name: wordsGroup.name,
      words: wordsGroup.words,
      date: new Date()
    });
  }

  public async getGroups() {
    const store = this.db.transaction('group').objectStore('group');
    const values = await store.getAll();
    return values;
  }

  public async getGroupByID(id: number) {
    const store = this.db.transaction('group').objectStore('group');
    const value = await store.get(id);
    return value;
  }

  public async addArticle(groupID: number, content: string) {
    return await this.db.add('article', {
      groupID: groupID,
      content: content,
      date: new Date()
    });
  }

  public async getArticles(groupID: number) {
    const values = await this.db.getAllFromIndex('article', 'groupID', groupID);
    return values;
  }
}

export default Storage;