import mongoose, { Document, Schema, SchemaTypes } from "mongoose";

interface VendorDocument extends Document {
  name: string;
  ownerName: string;
  foodTypes: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: [string];
  rating: number;
  foods: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodTypes: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean, default: false },
    coverImages: [String],
    rating: Number,
    foods: [{ type: SchemaTypes.ObjectId, ref: "food" }],
  },
  {
    toJSON: {
      transform(doc, obj) {
        delete obj.password;
        delete obj.salt;
        delete obj.__v;
        delete obj.createdAt;
        delete obj.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Vendor = mongoose.model<VendorDocument>("vendor", VendorSchema);

export { Vendor };
