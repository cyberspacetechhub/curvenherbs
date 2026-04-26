const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
   name: { 
    type: String, 
    required: true,
  },

  slug: { type: String, unique: true, lowercase: true }, // bum-hips-growth-syrup

  description: { type: String, required: true }, // Short marketing description

  longDescription: { type: String }, // Detailed explanation

  // Key Highlight
  isInHouse: { type: Boolean, default: true }, // "Sourced & Formulated by Us in Abakaliki"
  formulationNote: { 
    type: String, 
    default: "Sourced and formulated in-house by our certified herbal formulator in Abakaliki, Ebonyi State using 100% natural herbs."
  },

  category: { 
    type: String, 
    enum: ["Weight Gain", "Curve Enhancement", "Flat Tummy", "Combo Packs", "Topical", "Suppository"],
    required: true 
  },

  subCategory: {
    type: String,
    enum: ["Syrup", "Powder", "Cream", "Oil", "Set"]
}, // e.g., "Syrup", "Powder", "Cream", "Oil", "Set"

  price: { type: Number, required: true }, // in Naira (₦)
  discountedPrice: Number,
  currency: { type: String, default: "NGN" },

  stock: { type: Number, default: 0 },
  isInStock: { type: Boolean, default: true },

  images: [{
    url: String,
    alt: String,
    isMain: Boolean
  }],

  keyBenefits: [{ type: String }], // e.g., ["Targeted bum & hips growth", "Increases appetite", "No side effects"]

  ingredients: [{ 
    name: String, 
    description: String // e.g., "Ashwagandha - helps reduce stress and boost appetite"
  }],

  usageInstructions: String, // "Take 2 tablespoons twice daily after meals"

  recommendedFor: String, // "Hardgainers wanting lower body curves", "General weight gain"

  expectedResults: String, // "Visible results in 4-8 weeks with consistent use + calorie surplus"

  sizeVolume: String, // "500ml", "250g", etc.
  packSize: String, // "Single", "Combo"

  tags: [String], // ["best-seller", "slim-thick", "natural", "wholesale"]

  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });


const Product = mongoose.model("Product", productSchema);

module.exports = Product;