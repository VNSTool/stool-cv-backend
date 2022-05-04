import internal from 'stream';

export interface IStorageService {
  storage_type: string;

  save(path: string, body: internal.Readable | ReadableStream);
  delete(path: string);
}

export const StorageService = 'STORAGE_SERVICE';
