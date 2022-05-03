import multer from 'multer';
import { Request, Express } from 'express';
import { IStorageService } from '~/modules/shared/interfaces';
import { v4 as uuidv4 } from 'uuid';

const FOLDER = 'job-detail';

class CustomStorageEngine implements multer.StorageEngine {
  private storageService: IStorageService;

  constructor(opts) {
    this.storageService = opts.storageService;
  }

  _handleFile = (
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void => {
    const filePath = this.getFilePath(file.originalname);
    this.storageService.save(filePath, file.stream);
    cb(null, {
      originalname: file.originalname,
      path: filePath,
    });
  };

  _removeFile = (
    _req: Request,
    file: Express.Multer.File & { name: string },
    cb: (error: Error | null) => void,
  ): void => {
    console.log(222, file.stream);
    cb(null);
  };

  private getFilePath = (fileName: String): string => {
    return FOLDER + '/' + fileName;
  };
}

export default (opts) => {
  return new CustomStorageEngine(opts);
};
