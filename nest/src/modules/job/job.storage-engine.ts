import multer from 'multer';
import { Request, Express } from 'express';
import { IStorageService } from '~/modules/shared/interfaces';
import { v4 as uuidv4 } from 'uuid';

const FOLDER = 'job-detail';

export interface CustomFile extends Partial<Express.Multer.File> {
  storageType: string;
}

class JobDetailStorageEngine implements multer.StorageEngine {
  private storageService: IStorageService;

  constructor(opts) {
    this.storageService = opts.storageService;
  }

  _handleFile = async (
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: CustomFile) => void,
  ): Promise<void> => {
    const filePath = this.getFilePath(
      this.generateUniqueFileName(file.originalname),
    );

    try {
      await this.storageService.save(filePath, file.stream);
      cb(null, {
        originalname: file.originalname,
        path: filePath,
        storageType: this.storageService.storage_type,
      });
    } catch (error) {
      cb(error, null);
    }
  };

  _removeFile = async (
    _req: Request,
    file: Express.Multer.File & { name: string },
    cb: (error: Error | null) => void,
  ): Promise<void> => {
    try {
      await this.storageService.delete(file.path);
      cb(null);
    } catch (error) {
      cb(error);
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
