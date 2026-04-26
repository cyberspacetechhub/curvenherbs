const { submitMessage, getAllMessages, markAsRead, deleteMessage } = require('../services/contactService');

const handleSubmitMessage = async (req, res) => {
  const message = await submitMessage(req.body);
  res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
};

const handleGetAllMessages = async (req, res) => {
  const messages = await getAllMessages();
  res.json({ success: true, data: messages });
};

const handleMarkAsRead = async (req, res) => {
  const message = await markAsRead(req.params.id);
  res.json({ success: true, data: message });
};

const handleDeleteMessage = async (req, res) => {
  await deleteMessage(req.params.id);
  res.json({ success: true, message: 'Message deleted' });
};

module.exports = { handleSubmitMessage, handleGetAllMessages, handleMarkAsRead, handleDeleteMessage };
