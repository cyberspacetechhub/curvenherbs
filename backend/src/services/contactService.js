const ContactMessage = require('../models/ContactMessage');

const submitMessage = async (data) => {
  return await ContactMessage.create(data);
};

const getAllMessages = async () => {
  return await ContactMessage.find().sort({ createdAt: -1 });
};

const markAsRead = async (id) => {
  return await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

const deleteMessage = async (id) => {
  return await ContactMessage.findByIdAndDelete(id);
};

module.exports = { submitMessage, getAllMessages, markAsRead, deleteMessage };
