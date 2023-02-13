import { DBSchema } from 'idb';

export interface IWordsPanel {
  id?: number;
  date?: Date;
  name: string;
  words: string[];
}

export interface IArticle {
  groupID: number;
  content: string;
  date: Date;
}

export interface IDB extends DBSchema {
  group: {
    key: number;
    value: IWordsPanel;
  };
  article: {
    key: number;
    value: IArticle;
    indexes: {
      'groupID': number
    }
  };
}