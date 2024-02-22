import { Token } from "../models/tokenSchema.js";

export async function tokenCheck(phone) {
  const result = await Token.findOne({ phone: phone });

  if ((result.phone === phone) & (result.isAuth === true)) {
    return true;
  }
  return false;
}
