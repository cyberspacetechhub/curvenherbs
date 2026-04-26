const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadFromBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadImage = async (fileOrPath, folder = 'curvenherbs') => {
  // If it's a buffer (from multer memoryStorage), stream it
  if (Buffer.isBuffer(fileOrPath)) {
    return await uploadFromBuffer(fileOrPath, folder);
  }
  // Otherwise treat as file path (disk storage)
  const result = await cloudinary.uploader.upload(fileOrPath, {
    folder,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
