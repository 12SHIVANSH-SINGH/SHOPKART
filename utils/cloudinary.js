// utils/cloudinary.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 1. Working directory aur .env check
console.log('CWD:', process.cwd());
console.log('.env exists?', fs.existsSync(path.resolve(process.cwd(), '.env')));

// 2. Load env
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});




// 4. Now configure Cloudinary
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 5. Early crash if missing
['cloud_name','api_key','api_secret'].forEach(k => {
  if (!cloudinary.config()[k]) {
    console.error(`Fatal: Missing Cloudinary ${k}`);
    process.exit(1);
  }
});

// 6. Your upload util
import fsSync from 'fs';
export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });
    console.log('✅ Uploaded:', res.url);
    fsSync.unlinkSync(localFilePath);
    return res;
  } catch (err) {
    console.error('☠️ Cloudinary upload failed:', err);
    fsSync.unlinkSync(localFilePath);
    return null;
  }
};
