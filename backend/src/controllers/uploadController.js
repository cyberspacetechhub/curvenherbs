const { uploadImage, deleteImage } = require('../services/uploadService');

const handleUploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image file provided' });

  const folder = req.query.folder || 'curvenherbs';
  const { url, publicId } = await uploadImage(req.file.buffer, folder);

  res.status(201).json({ success: true, data: { url, publicId } });
};

const handleDeleteImage = async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ success: false, message: 'publicId is required' });

  await deleteImage(publicId);
  res.json({ success: true, message: 'Image deleted' });
};

module.exports = { handleUploadImage, handleDeleteImage };
