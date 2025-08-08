import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<Record<string, string>> {
    return new Promise((resolve, reject) => {
      // Define publicId
      const public_id = file.originalname.split('.').slice(0, -1).join('.');

      // Upload file_stream to cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id,
          unique_filename: false,
          use_filename: true,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            imageUrl: result?.secure_url,
            imagePublicId: result?.public_id,
          });
        },
      );

      // Convert buffer to readable stream
      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<boolean> {
    try {
      console.log('The avatar public id is ', publicId);
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw error;
    }
  }

  async getImagesInFolder(): Promise<Record<string, string[]>> {
    try {
      // Get cloudinary images info
      const response = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'USER_AVATARS', // Fetches all images in the given folder
        max_results: 100, // Adjust if needed, max allowed by Cloudinary is 500
      });

      // Extract URLs of images
      return {
        secure_urls: response.resources.map(
          (resource: any) => resource.secure_url,
        ),
        public_ids: response.resources.map(
          (resource: any) => resource.public_id,
        ),
      };
    } catch (error) {
      throw new Error(
        `Error fetching images from Cloudinary: ${error.message}`,
      );
    }
  }
}
