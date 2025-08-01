import * as multer from 'multer';
import { User } from 'src/users/entity/users.entity';

declare global {
  namespace Express {
    interface Request {
      file: multer.File;
      user?: User & { userId?: string };
    }
  }
}
