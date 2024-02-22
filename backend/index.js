import express from "express";
import cors from "cors";
import { getToken, sendTokenToSMS } from "./services/phone.js";
import mongoose from "mongoose";
import "dotenv/config";
import { scrapping } from "./services/scrapping.js";
import { User } from "./models/userSchema.js";
import { tokenCheck } from "./services/token.js";
import { sendTemplateToEmail, getWelcomeTemplate } from "./services/email.js";
import { Token } from "./models/tokenSchema.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/tokens/phone", async function (req, res) {
  const phone = req.body.phone;
  const token = getToken();
  // console.log(token);

  const isUsed = await Token.findOne({ phone: phone });
  if (isUsed) {
    await Token.findOneAndUpdate(
      { phone: phone },
      { token: token, isAuth: false }
    );
  } else {
    await Token.create({ token: token, phone: phone, isAuth: false });
  }

  sendTokenToSMS(phone, token);

  res.send(`${phone}으로 인증 문자가 전송되었습니다.`);
});

// 인증 완료 API
app.patch("/tokens/phone", async function (req, res) {
  const phone = req.body.phone;
  const token = req.body.token;

  const isUsed = await Token.findOne({ phone: phone });

  if (!isUsed) {
    res.send(false);
    return;
  }

  if (isUsed.token === token) {
    await Token.findOneAndUpdate(
      { phone: phone },
      { token: token, isAuth: true }
    );
    res.send(true);
  } else {
    res.send(false);
  }
});

// 회원 가입 API
app.post("/users", async function (req, res) {
  const data = req.body.signup;
  const { name, global_phone, personal, prefer, email, pwd } = data;
  const phone = global_phone;

  if (!tokenCheck(phone)) {
    const error = new Error("에러!! 핸드폰 번호가 인증되지 않았습니다");
    error.statusCode = 422;
    throw error;
  }

  const result = await scrapping(prefer);

  const user = new User({
    name,
    email,
    personal: personal.substring(0, 6) + "-******",
    prefer,
    pwd,
    phone,
    og: result,
  });
  await user.save();

  const template = getWelcomeTemplate({ name, phone, prefer });
  sendTemplateToEmail(email, template);

  res.send(user._id);
});

// 회원 목록 조회
app.get("/users", async function (_, res) {
  const result = await User.find();
  res.send(result);
});

mongoose.set("debug", true);

mongoose
  .connect("mongodb://my-database:27017/mini-project")
  .then(() => console.log("db 접속에 성공하였습니다."))
  .catch(() => console.log("db 접속에 실패하였습니다."));

app.listen(4000, () => {
  console.log("백엔드 API 서버가 켜졌어요!!!");
});
