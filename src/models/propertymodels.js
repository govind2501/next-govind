import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    trim: true,
    required: function () {
      return this.listingType === "Sell";
    },
  },
  description: {
    type: String,
    required: function () {
      return this.listingType === "Sell";
    },
  },

  listingType: {
    type: String,
    enum: ["Sell", "BuyerRequirement"],
    required: true,
    default: "Sell",
  },

  propertyType: {
    type: String,
    enum: ["Land", "House", "Shop"],
    required: true,
  },

  transactionType: {
    type: String,
    enum: ["Sell", "Rent"],
    required: true,
  },

  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  priceUnit: {
    type: String,
    enum: ["Total", "PerMonth", "PerSqft"],
    default: "Total",
  },

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

  area: {
    type: Number,
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

  // Video (Cloudinary hosted URL)
  video: {
    type: String,
    default: "",
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

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

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  rejectionReason: {
    type: String,
  },

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