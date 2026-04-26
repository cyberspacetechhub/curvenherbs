const Testimony = require('../models/Testimony');

const submitTestimony = async (data) => {
  return await Testimony.create(data);
};

const approveTestimony = async (id) => {
  const testimony = await Testimony.findByIdAndUpdate(id, { approved: true }, { new: true });
  if (!testimony) throw new Error('Testimony not found');
  return testimony;
};

const getApprovedTestimonies = async () => {
  return await Testimony.find({ approved: true })
    .populate('productUsed', 'name slug')
    .sort({ createdAt: -1 });
};

const getPendingTestimonies = async () => {
  return await Testimony.find({ approved: false }).sort({ createdAt: -1 });
};

const deleteTestimony = async (id) => {
  return await Testimony.findByIdAndDelete(id);
};

module.exports = { submitTestimony, approveTestimony, getApprovedTestimonies, getPendingTestimonies, deleteTestimony };
