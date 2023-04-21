import mongoose from "mongoose";
import { userSchema } from "./usersSchema.js";
import { CartController } from "../../../carts/cartController.js";

const userCollection = "users";

const userModel = mongoose.model(userCollection, userSchema);

export class UsersModel {
  constructor() {
    this.db = userModel;
  }
  createUser = async (user) => {
    let cartController = new CartController();
    let cart = await cartController.createCart();
    user.cart = cart._id;
    return await this.db.create(user);
  };
  searchUser = async (email) => {
    
    return await this.db.findOne({ email: email });
  };
  searchUserById = async (id) => {
    return await this.db.findById(id);
  };
}
