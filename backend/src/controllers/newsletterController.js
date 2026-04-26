const { subscribe, unsubscribe, getAllSubscribers } = require('../services/newsletterService');

const handleSubscribe = async (req, res) => {
  const result = await subscribe(req.body.email);
  res.status(201).json({ success: true, message: 'Subscribed successfully', data: result });
};

const handleUnsubscribe = async (req, res) => {
  await unsubscribe(req.body.email);
  res.json({ success: true, message: 'Unsubscribed successfully' });
};

const handleGetAllSubscribers = async (req, res) => {
  const subscribers = await getAllSubscribers();
  res.json({ success: true, data: subscribers });
};

module.exports = { handleSubscribe, handleUnsubscribe, handleGetAllSubscribers };
