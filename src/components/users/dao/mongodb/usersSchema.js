import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    user: String,
    email: String,
    age: Number,
    password: String,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
    },
    social: String,
    rol: {
      type:String,
      default:"user"
    },
  });
  
  userSchema.plugin(mongoosePaginate);