import mongoose, { Document, Schema, SchemaTypes } from "mongoose";

interface FoodDocument extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  images: [string];
}

const FoodSchema = new Schema(
  {
    vendorId: { type: SchemaTypes.ObjectId, ref: "vendor" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: String,
    foodType: { type: String, required: true },
    readyTime: Number,
    price: { type: Number, required: true },
    rating: Number,
    images: [String],
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

const Food = mongoose.model<FoodDocument>("food", FoodSchema);

export { Food };
