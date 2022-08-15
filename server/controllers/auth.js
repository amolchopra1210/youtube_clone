import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).send("User has been created");
  } catch (err) {
    next(errorHandler(404, "not found sorry"));
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(errorHandler(404, "User not found"));

    //check password

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(errorHandler(404, "Wrong credentials!"));

    //create jwt
    const token = jwt.sign({ id: user._id }, process.env.SIGNATURE);
    const {password, ...otherData} = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(otherData);
  } catch (err) {
    next(errorHandler(404, "not found sorry"));
  }
};
