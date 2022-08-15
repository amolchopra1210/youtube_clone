import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "you are not authenticated"));
  jwt.verify(token, process.env.SIGNATURE, (err, user) => {
    if (err) return next(errorHandler(401, "Token is not valid"));
    req.user = user;
    next();
  });
};
