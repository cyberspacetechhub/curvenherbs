const { submitTestimony, approveTestimony, getApprovedTestimonies, getPendingTestimonies, deleteTestimony } = require('../services/testimonyService');
const { uploadImage } = require('../services/uploadService');

const handleSubmitTestimony = async (req, res) => {
  const data = { ...req.body };

  if (req.files?.beforeImage) {
    const { url } = await uploadImage(req.files.beforeImage[0].path, 'curvenherbs/testimonies');
    data.beforeImage = url;
  }
  if (req.files?.afterImage) {
    const { url } = await uploadImage(req.files.afterImage[0].path, 'curvenherbs/testimonies');
    data.afterImage = url;
  }

  const testimony = await submitTestimony(data);
  res.status(201).json({ success: true, data: testimony });
};

const handleGetApprovedTestimonies = async (req, res) => {
  const testimonies = await getApprovedTestimonies();
  res.json({ success: true, data: testimonies });
};

const handleGetPendingTestimonies = async (req, res) => {
  const testimonies = await getPendingTestimonies();
  res.json({ success: true, data: testimonies });
};

const handleApproveTestimony = async (req, res) => {
  const testimony = await approveTestimony(req.params.id);
  res.json({ success: true, data: testimony });
};

const handleDeleteTestimony = async (req, res) => {
  await deleteTestimony(req.params.id);
  res.json({ success: true, message: 'Testimony deleted' });
};

module.exports = { handleSubmitTestimony, handleGetApprovedTestimonies, handleGetPendingTestimonies, handleApproveTestimony, handleDeleteTestimony };
