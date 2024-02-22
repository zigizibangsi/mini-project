import coolsms from "coolsms-node-sdk";
import "dotenv/config";

const mysms = coolsms.default;

export function getToken() {
  const result = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  return result;
}

const SMS_KEY = process.env.SMS_KEY;
const SMS_SECRET = process.env.SMS_SECRET;
const SMS_SENDER = process.env.SMS_SENDER;

export function sendTokenToSMS(phone, token) {
  const messageService = new mysms(SMS_KEY, SMS_SECRET);
  messageService.sendOne({
    to: phone,
    from: SMS_SENDER,
    text: `[지기지방] 요청하신 인증번호는 ${token} 입니다.`,
  });
}
