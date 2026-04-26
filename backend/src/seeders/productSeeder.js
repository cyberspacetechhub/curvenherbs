require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const connectDB = require('../config/dbConn');
const Product = require('../models/Products');
const slugify = require('slugify');

const products = [
  {
    name: 'Bum & Hips Growth Syrup',
    description: 'A powerful herbal syrup formulated to target bum, hips, and thigh growth naturally.',
    longDescription: 'Our flagship product combines Ashwagandha, Shatavari, and other premium herbs to stimulate healthy fat distribution to the lower body. Consistent use with a calorie surplus delivers visible results in 4–8 weeks.',
    category: 'Curve Enhancement',
    subCategory: 'Syrup',
    price: 15000,
    discountedPrice: 13500,
    stock: 50,
    isInStock: true,
    keyBenefits: ['Targeted bum & hips growth', 'Boosts appetite', 'No side effects', '100% natural herbs'],
    ingredients: [
      { name: 'Ashwagandha', description: 'Reduces stress and boosts appetite for healthy weight gain' },
      { name: 'Shatavari', description: 'Supports hormonal balance and feminine curve development' }
    ],
    usageInstructions: 'Take 2 tablespoons twice daily after meals. Shake well before use.',
    recommendedFor: 'Women wanting targeted lower body curve enhancement',
    expectedResults: 'Visible results in 4–8 weeks with consistent use and a calorie surplus',
    sizeVolume: '500ml',
    packSize: 'Single',
    tags: ['best-seller', 'curve-enhancement', 'natural', 'bum-hips']
  },
  {
    name: 'Curve Booster Powder',
    description: 'A herbal powder blend designed to boost curves and support healthy weight gain.',
    longDescription: 'Mix into smoothies, pap, or warm water. Packed with natural herbs that support appetite stimulation and healthy fat distribution to the hips, bum, and thighs.',
    category: 'Curve Enhancement',
    subCategory: 'Powder',
    price: 12000,
    stock: 40,
    isInStock: true,
    keyBenefits: ['Boosts curves naturally', 'Easy to mix into meals', 'Appetite stimulant', 'No chemicals'],
    ingredients: [
      { name: 'Shatavari', description: 'Supports feminine hormonal balance' },
      { name: 'Fenugreek', description: 'Known for promoting healthy weight gain and curve development' }
    ],
    usageInstructions: 'Mix 2 tablespoons into warm water, pap, or smoothie once daily.',
    recommendedFor: 'Women who prefer powder form over syrup',
    expectedResults: 'Noticeable changes in 6–8 weeks with consistent use',
    sizeVolume: '250g',
    packSize: 'Single',
    tags: ['curve-enhancement', 'powder', 'natural']
  },
  {
    name: 'Herbal Weight Gain Mixture',
    description: 'A full-body weight gain herbal mixture for women who want to gain healthy weight all over.',
    longDescription: 'Formulated for hardgainers who struggle to put on weight. This mixture stimulates appetite, improves nutrient absorption, and supports overall healthy weight gain.',
    category: 'Weight Gain',
    subCategory: 'Syrup',
    price: 13000,
    stock: 35,
    isInStock: true,
    keyBenefits: ['Full body weight gain', 'Stimulates appetite', 'Improves nutrient absorption', 'Natural & safe'],
    ingredients: [
      { name: 'Ashwagandha', description: 'Boosts appetite and reduces stress-related weight loss' },
      { name: 'Ginger Root', description: 'Improves digestion and nutrient absorption' }
    ],
    usageInstructions: 'Take 2 tablespoons three times daily before meals.',
    recommendedFor: 'Hardgainers and women wanting general healthy weight gain',
    expectedResults: 'Visible weight gain in 4–6 weeks with consistent use and proper diet',
    sizeVolume: '500ml',
    packSize: 'Single',
    tags: ['weight-gain', 'appetite', 'natural']
  },
  {
    name: 'Bum & Hips Combo Pack',
    description: 'The ultimate combo — Bum & Hips Growth Syrup + Curve Booster Powder at a discounted price.',
    longDescription: 'Get faster results by combining our two most powerful curve enhancement products. The syrup works internally while the powder boosts your daily nutrient intake for maximum curve development.',
    category: 'Combo Packs',
    subCategory: 'Set',
    price: 25000,
    discountedPrice: 22000,
    stock: 20,
    isInStock: true,
    keyBenefits: ['Faster results', 'Best value combo', 'Syrup + Powder synergy', 'Save ₦3,000'],
    usageInstructions: 'Use syrup twice daily after meals. Mix powder into meals once daily.',
    recommendedFor: 'Women who want maximum and faster curve results',
    expectedResults: 'Visible results in 3–6 weeks with consistent use',
    sizeVolume: '500ml + 250g',
    packSize: 'Combo',
    tags: ['combo', 'best-value', 'best-seller', 'curve-enhancement']
  }
];

const seedProducts = async () => {
  await connectDB();

  const exists = await Product.countDocuments();
  if (exists > 0) {
    console.log('[Seeder] Products already exist. Skipping.');
    process.exit(0);
  }

  const withSlugs = products.map(p => ({
    ...p,
    slug: slugify(p.name, { lower: true, strict: true })
  }));

  await Product.insertMany(withSlugs);
  console.log(`[Seeder] ${withSlugs.length} products seeded successfully.`);
  process.exit(0);
};

seedProducts().catch(err => { console.error(err); process.exit(1); });
