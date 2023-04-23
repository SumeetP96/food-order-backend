import mongoose, { Document, Schema, SchemaTypes } from "mongoose";

export interface OrderDocument extends Document {
  orderId: string;
  vendorId: string;
  items: [any];
  totalAmount: number;
  orderDate: Date;
  paidThrough: string;
  paymentResponse: string;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  appliedOffers: boolean;
  offerId: string;
  readyTime: number;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "vendor" },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderDate: Date,
    paidThrough: String,
    paymentResponse: String,
    orderStatus: String,
    remarks: String,
    deliveryId: String,
    appliedOffers: Boolean,
    offerId: String,
    readyTime: Number,
  },
  {
    toJSON: {
      transform(doc, obj) {
        delete obj.__v;
        delete obj.createdAt;
        delete obj.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDocument>("order", OrderSchema);

export { Order };
