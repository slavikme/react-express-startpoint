export enum StorageType {
  NoStorage,
  LocalStorage,
  SessionStorage,
}

type StorageSet = <T>(storageType: StorageType, key: string, value: T) => T;
type StorageGet = <T>(storageType: StorageType, key: string) => T;
type StorageClear = (storageType: StorageType, key: string) => void;

interface IStorage extends StorageSet, StorageGet {
  clear: StorageClear;

  set: StorageSet;
  store: StorageSet;
  save: StorageSet;

  get: StorageGet;
  retrieve: StorageGet;
  load: StorageGet;
}

export function _storage(storageType: StorageType, key: string): any;
export function _storage(storageType: StorageType, key: string, value: any): void
export function _storage(storageType: StorageType, key: string, value?: any) {
  if ( value === void 0 ) {
    let data;

    switch (storageType) {
      case StorageType.LocalStorage:
        data = localStorage.getItem(key);
        break;
      case StorageType.SessionStorage:
        data = sessionStorage.getItem(key);
        break;
    }

    if ( typeof data !== 'string' )
      return data;

    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  switch (storageType) {
    case StorageType.LocalStorage:
      return localStorage.setItem(key, JSON.stringify(value));
    case StorageType.SessionStorage:
      return sessionStorage.setItem(key, JSON.stringify(value));
  }
}

export const storage: IStorage = _storage as IStorage;

storage.clear = (storageType, key) => {
  switch (storageType) {
    case StorageType.LocalStorage:
      return localStorage.removeItem(key);
    case StorageType.SessionStorage:
      return sessionStorage.removeItem(key);
  }
}

storage.set = storage.store = storage.save = storage.get = storage.retrieve = storage.load = _storage;

export default storage;
