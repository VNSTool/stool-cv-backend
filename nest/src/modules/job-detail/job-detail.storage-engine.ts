import multer from 'multer';
import { Request, Express } from 'express';
import { IStorageService } from '~/modules/shared/interfaces';
import { v4 as uuidv4 } from 'uuid';

const FOLDER = 'job-detail';

class JobDetailStorageEngine implements multer.StorageEngine {
  private storageService: IStorageService;

  constructor(opts) {
    this.storageService = opts.storageService;
  }

  _handleFile = (
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void => {
    try {
      const filePath = this.getFilePath(
        this.generateUniqueFileName(file.originalname),
      );
      this.storageService.save(filePath, file.stream);

      cb(null, {
        originalname: file.originalname,
        path: filePath,
      });
    } catch (e) {
      cb(e);
    }
  };

  _removeFile = (
    _req: Request,
    file: Express.Multer.File & { name: string },
    cb: (error: Error | null) => void,
  ): void => {
    try {
      this.storageService.delete(file.path);

      cb(null);
    } catch (e) {
      cb(e);
    }
  };

  private generateUniqueFileName = (fileName: String): string => {
    return uuidv4() + '.' + fileName;
  };

  private getFilePath = (fileName: string): string => {
    return FOLDER + '/' + fileName;
  };
}

export default (opts) => {
  return new JobDetailStorageEngine(opts);
};
