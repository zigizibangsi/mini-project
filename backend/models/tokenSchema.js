import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  phone: String,
  token: String,
  isAuth: Boolean,
});

export const Token = mongoose.model("Token", tokenSchema);
