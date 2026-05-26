import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { env } from '../config/env.js';

console.log(' [CLOUDINARY CONFIG] Cloud Name:', env.cloudinary.cloudName);
console.log(' [CLOUDINARY CONFIG] API Key:', env.cloudinary.apiKey ? 'PRESENT' : 'MISSING');
console.log(' [CLOUDINARY CONFIG] API Secret:', env.cloudinary.apiSecret ? 'PRESENT' : 'MISSING');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true
});

// Image storage (profile pics)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'staxhaus/profiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    resource_type: 'image',
  },
});

// Document storage (resume / documents) - raw resource type for PDFs, DOCX
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const docType = req.body?.docType || 'document'; // 'resume' or 'document'
    return {
      folder: `staxhaus/student-docs/${docType}s`,
      allowed_formats: ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'],
      resource_type: 'raw',
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
    };
  },
});

export const upload = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export { cloudinary };
