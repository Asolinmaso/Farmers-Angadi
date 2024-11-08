import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  cost: number;
  discount: number;
  image: string;
  about: string;
  category: string;
  creatorId: mongoose.Schema.Types.ObjectId; // Ensure type consistency
}

const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    image: { type: String, required: true },
    about: { type: String, required: true },
    category: { type: String, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "minimumuserdata", required: true }, // Consistent ref name

  },
  { timestamps: true }
);

const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
