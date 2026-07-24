import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    trim: true,
    required: function () {
      return this.listingType === "Sell"; // required only for Sell listings
    },
  },
  description: {
    type: String,
    required: function () {
      return this.listingType === "Sell"; // required only for Sell listings
    },
  },

  // Listing Type: Seller posting a property / Buyer posting a requirement
  listingType: {
    type: String,
    enum: ["Sell", "BuyerRequirement"],
    required: true,
    default: "Sell",
  },

  // Property Type: Jamin / Makan / Dukan
  propertyType: {
    type: String,
    enum: ["Land", "House", "Shop"],
    required: true,
  },

  // Transaction Type: Sell / Rent
  transactionType: {
    type: String,
    enum: ["Sell", "Rent"],
    required: true,
  },

  // Price (used as Budget for BuyerRequirement)
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  priceUnit: {
    type: String,
    enum: ["Total", "PerMonth", "PerSqft"],
    default: "Total",
  },

  // Location - State & District
  state: {
    type: String,
    required: [true, "Please select a state"],
  },
  district: {
    type: String,
    required: [true, "Please select a district"],
  },
  city: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
  },

  // Property Details
  area: {
    type: Number, // in sqft
  },
  bedrooms: {
    type: Number,
    default: 0,
  },
  bathrooms: {
    type: Number,
    default: 0,
  },

  // Images
  images: [
    {
      type: String, // Cloudinary/hosted URLs
    },
  ],

  // Owner Reference (jisne listing daali)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

    // Contact Info (quick access ke liye)
  ownerName: {
    type: String,
    trim: true,
    required: [true, "Please provide contact name"],
  },
  ownerEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  contactPhone: {
    type: String,
    required: [true, "Please provide contact phone"],
  },

  // Admin Approval Workflow
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  rejectionReason: {
    type: String,
  },

  // Extra useful fields
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Property = mongoose.models.properties || mongoose.model("properties", propertySchema);

export default Property;