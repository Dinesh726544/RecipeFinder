

import multer from 'multer';

// Use memory storage for direct Cloudinary uploads
const storage = multer.memoryStorage();

export const upload = multer({ storage });


