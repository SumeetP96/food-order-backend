import mongoose, { Document, Schema } from "mongoose";

interface VendorDocument extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImage: [string];
  rating: number;
  // foods: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImage: [String],
    rating: Number,
    // foods: [{ type: mongoose.SchemaTypes.ObjectId, ref: "food" }],
  },
  {
    toJSON: {
      transform(doc, obj) {
        delete obj.password,
          delete obj.salt,
          delete obj.__v,
          delete obj.createdAt,
          delete obj.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Vendor = mongoose.model<VendorDocument>("vendor", VendorSchema);

export { Vendor };
