import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "mongoose";
export const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: Number,
  price: Number,
  status: Boolean,
  stock: Number,
  thumbnail: String,
});
productsSchema.plugin(mongoosePaginate);
