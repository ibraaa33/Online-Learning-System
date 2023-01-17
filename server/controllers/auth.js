import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

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
      expiresIn: "7d",
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
  }};

export const logout = async (req, res) => {
    try {
      res.clearCookie("token");
      return res.json({ message: "Signout success" });
    } catch (err) {
      console.log(err);
    }}

  
    export const currentUser = async (req, res) => {
      try {
        const user = await User.findById(req.user._id).select("-password").exec();
        console.log("CURRENT_USER", user);
        return res.json({ ok: true });
      } catch (err) {
        console.log(err);
      }
    };

    export const forgotPassword = async (req, res) => {
      try {
        const { email } = req.body;
        // console.log(email);
        const shortCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate(
          { email },
          { passwordResetCode: shortCode }
        );
        if (!user) return res.status(400).send("User not found");
    
        // prepare for email
        const params = {
          Source: process.env.EMAIL_FROM,
          Destination: {
            ToAddresses: ['ibraaa33@icloud.com'],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `
                    <html>
                      <h1>Reset password</h1>
                      <p>User this code to reset your password</p>
                      <h2 style="color:red;">${shortCode}</h2>
                      <i>edemy.com</i>
                    </html>
                  `,
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Reset Password",
            },
          },
        };
    
        const emailSent = SES.sendEmail(params).promise();
        emailSent
          .then((data) => {
            console.log(data);
            res.json({ ok: true });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    };
    