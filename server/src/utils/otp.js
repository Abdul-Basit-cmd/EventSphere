import crypto from "crypto";

export const generateOTP = () => {
  const min = 100000;
  const max = 999999;
  const range = max - min + 1;
  
  const randomInt = crypto.randomInt(min, max + 1);
  return randomInt.toString();
};
