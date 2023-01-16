import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { username,firstName,lastName, email, password,gender } = req.body;
    // validation
    if (!username) return res.status(400).send("Usrname is required");
    if (!firstName) return res.status(400).send("First anme is required");
    if (!lastName) return res.status(400).send("Last name is required");
    if (!gender) return res.status(400).send("Gender is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    let usernameExist = await User.findOne({ username }).exec();
    if (usernameExist) return res.status(400).send("Username is taken");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password:hashedPassword,
      gender
    });
    await user.save();
    console.log("saved user", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
  
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, password } = req.body;
    // check if our db has user with that username
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send("No user found");
    // check password
    const match = await comparePassword(password, user.password);
    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    // send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }}
