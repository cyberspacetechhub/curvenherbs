const Newsletter = require('../models/Newsletter');

const subscribe = async (email) => {
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.isSubscribed) throw new Error('Email already subscribed');
    existing.isSubscribed = true;
    return await existing.save();
  }
  return await Newsletter.create({ email });
};

const unsubscribe = async (email) => {
  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber) throw new Error('Email not found');
  subscriber.isSubscribed = false;
  return await subscriber.save();
};

const getAllSubscribers = async () => {
  return await Newsletter.find({ isSubscribed: true }).select('email createdAt');
};

module.exports = { subscribe, unsubscribe, getAllSubscribers };
