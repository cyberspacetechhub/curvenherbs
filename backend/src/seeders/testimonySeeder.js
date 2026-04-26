require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const connectDB = require('../config/dbConn');
const Testimony = require('../models/Testimony');
const Product = require('../models/Products');

const seedTestimonies = async () => {
  await connectDB();

  const exists = await Testimony.countDocuments();
  if (exists > 0) {
    console.log('[Seeder] Testimonies already exist. Skipping.');
    process.exit(0);
  }

  const syrup = await Product.findOne({ slug: 'bum-hips-growth-syrup' });
  const combo = await Product.findOne({ slug: 'bum-hips-combo-pack' });

  const testimonies = [
    {
      customerName: 'Chioma A.',
      location: 'Enugu',
      timeTaken: '6 weeks',
      testimonial: 'I was so skeptical at first but after 6 weeks of using the Bum & Hips Syrup consistently, my jeans stopped fitting the same way. My hips are fuller and I feel so much more confident. This product is real!',
      productUsed: syrup?._id,
      rating: 5,
      approved: true
    },
    {
      customerName: 'Blessing O.',
      location: 'Lagos',
      timeTaken: '2 months',
      testimonial: 'I used the combo pack and the results were amazing. I gained weight in the right places — my bum and hips. My friends keep asking what I am doing differently. 100% natural and no side effects at all.',
      productUsed: combo?._id,
      rating: 5,
      approved: true
    },
    {
      customerName: 'Ngozi M.',
      location: 'Abakaliki',
      timeTaken: '5 weeks',
      testimonial: 'As someone from Abakaliki I trust this brand completely. The syrup is genuine and the results speak for themselves. My curves are more defined and I feel healthier overall.',
      productUsed: syrup?._id,
      rating: 5,
      approved: true
    },
    {
      customerName: 'Fatima B.',
      location: 'Abuja',
      timeTaken: '8 weeks',
      testimonial: 'I have tried so many products before but Curvenherbs is different. You can tell it is made with real herbs. After 8 weeks my bum is noticeably bigger and my confidence is through the roof.',
      productUsed: syrup?._id,
      rating: 4,
      approved: true
    }
  ];

  await Testimony.insertMany(testimonies);
  console.log(`[Seeder] ${testimonies.length} testimonies seeded successfully.`);
  process.exit(0);
};

seedTestimonies().catch(err => { console.error(err); process.exit(1); });
