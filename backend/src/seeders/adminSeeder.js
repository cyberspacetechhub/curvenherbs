require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/dbConn');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  await connectDB();

  const exists = await Admin.findOne({ type: 'Admin' });
  if (exists) {
    console.log('[Seeder] Superadmin already exists. Skipping.');
    process.exit(0);
  }

  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_PHONE } = process.env;
  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    console.error('[Seeder] SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required in .env');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
  await Admin.create({
    firstName: 'Curvenherbs',
    lastName: 'Admin',
    email: SUPER_ADMIN_EMAIL || 'admin@cuvrenherbs.com',
    phone: SUPER_ADMIN_PHONE || '08149838596',
    password: hashed,
    role: 'superadmin',
    isActive: true
  });

  console.log(`[Seeder] Superadmin created: ${SUPER_ADMIN_EMAIL}`);
  process.exit(0);
};

seedAdmin().catch(err => { console.error(err); process.exit(1); });
