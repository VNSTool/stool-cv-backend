import internal from 'stream';

export interface IStorageService {
  save(path: string, body: internal.Readable | ReadableStream);
  delete(path: string);
}

export const StorageService = 'STORAGE_SERVICE';
