require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const connectDB = require('../config/dbConn');
const Coupon = require('../models/Coupon');

const coupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 5000,
    maxUses: 100,
    isActive: true
  },
  {
    code: 'CURVES2000',
    discountType: 'fixed',
    discountValue: 2000,
    minOrderAmount: 15000,
    maxUses: 50,
    isActive: true
  },
  {
    code: 'FIRSTORDER',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 0,
    maxUses: 200,
    isActive: true
  }
];

const seedCoupons = async () => {
  await connectDB();

  const exists = await Coupon.countDocuments();
  if (exists > 0) {
    console.log('[Seeder] Coupons already exist. Skipping.');
    process.exit(0);
  }

  await Coupon.insertMany(coupons);
  console.log(`[Seeder] ${coupons.length} coupons seeded successfully.`);
  process.exit(0);
};

seedCoupons().catch(err => { console.error(err); process.exit(1); });
