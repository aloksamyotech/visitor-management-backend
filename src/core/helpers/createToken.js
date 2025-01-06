import jwt from "jsonwebtoken";

export const createToken = (payload, secretKey, expiresIn) => {
  return jwt.sign({ payload }, secretKey, { expiresIn });
};
