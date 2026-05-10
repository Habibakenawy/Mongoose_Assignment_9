import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { userModel } from "../../DB/model/index.js";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/utils/index.js";
import crypto from "crypto";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.SECRET_KEY, "hex");
const iv = crypto.randomBytes(16);

export const signup = async (inputs) => {
  const { name, email, Password, Phone, age } = inputs;
  const hashedPasswrod = await bcrypt.hash(
    Password,
    Number(process.env.SALT_ROUND),
  );
  const { encryptedData, iv } = encrypt(Phone);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const found = await userModel.find({ email });
    if (found.length != 0) {
      throw new ConflictException({ message: "Email already exists" });
    }
    const user = await userModel.create({
      name,
      email,
      Password: hashedPasswrod,
      Phone: encryptedData,
      iv_phone: iv,
      age,
    });
    await session.commitTransaction();
    return user;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
  };
}

function decrypt(encryptedData, ivHex) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivHex, "hex"),
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export const login = async (inputs) => {
  //msh m7taga transaction 3lshan msh b create data  // ana ba7afz 3la el integrity of data bel transaction
  const { email, Password } = inputs;
  const found = await userModel.findOne({ email });
  // if (found) {
  //   const hashedPassword = found.Password;
  //   const isMatch = await bcrypt.compare(Password, hashedPassword);
  //   if (!isMatch)
  //     return UnauthorizedException({ message: "Invalid email or password" });
  //   return found;
  // } else {
  //   return UnauthorizedException({ message: "Invalid email or password" });
  // }
  if (!found || !(await bcrypt.compare(Password, found.Password))) {
    throw UnauthorizedException({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ userId: found._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const updateUser = async (id, updatedData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email } = updatedData;
    if (email) {
      const found = await userModel.findOne({ email });
      if (found) {
        throw  ConflictException({ message: "Email already exists" });
      }
    }
    const updatedUser = await userModel
      .findByIdAndUpdate(
        id,
        { $set: updatedData, $inc:{__v:1} },
        { new: true, runValidators: true },
      )
      .select("-Password");
    if (!updatedUser) throw NotFoundException({ message: "User not found" });
    await session.commitTransaction();
    return updatedUser;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

export const deleteUser = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
   //const id_obj= new mongoose.Types.ObjectId(id)
    const deletedUser = await userModel.findByIdAndDelete(id)
    if (!deletedUser) throw NotFoundException({ message: "User not found" });
    await session.commitTransaction();
    return deletedUser;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};
