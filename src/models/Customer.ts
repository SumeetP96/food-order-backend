import mongoose, { Schema } from "mongoose";
import { OrderDocument } from "./Order";

interface CustomerDocument {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otpExpiry: Date;
  lat: number;
  lng: number;
  orders: [OrderDocument];
  cart: [any];
}

const CustomerSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: String,
    lastName: String,
    address: String,
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otpExpiry: { type: Date, required: true },
    lat: Number,
    lng: Number,
    orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
    cart: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food" },
        unit: { type: Number, required: true },
      },
    ],
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

const Customer = mongoose.model<CustomerDocument>("customer", CustomerSchema);

export { Customer };
