import nodemailer from "nodemailer";
import "dotenv/config";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_SENDER = process.env.EMAIL_SENDER;

export function checkEmail(email) {
  if (email === undefined || email.includes("@") === false) {
    return false;
  } else {
    return true;
  }
}

const today = new Date();

export function getWelcomeTemplate({ name, phone, prefer }) {
  const template = `
          <html>
              <body>
                  <h1>${name}님 가입을 환영합니다.</h1>
                  <hr />
                  <div>이름: ${name}</div>
                  <div>전화번호: ${phone}</div>
                  <div>좋아하는 사이트: ${prefer}</div>
                  <div>가입일: ${today}</div>
              </body>
          </html>
      `;

  return template;
}

export async function sendTemplateToEmail(email, result) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const res = await transporter.sendMail({
    from: EMAIL_SENDER,
    to: email,
    subject: "가입을 축하합니다!",
    html: result,
  });
}
