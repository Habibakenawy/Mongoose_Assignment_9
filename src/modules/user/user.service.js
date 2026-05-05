import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {userModel} from "../../DB/model/index.js"
import {ConflictException} from "../../common/utils/index.js"
import crypto  from "crypto"
import { config } from 'dotenv'


const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.SECRET_KEY, 'hex'); 
const iv = crypto.randomBytes(16);


export const signup = async (inputs) =>{
    const {name,email,Password,Phone,age}= inputs;
    const hashedPasswrod = await bcrypt.hash(Password,Number(process.env.SALT_ROUND))
    const {encryptedData,iv} = encrypt(Phone)
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const found = await userModel.find({email})
        if(found.length!=0){
         return ConflictException({ message: "Email already exists" })
        }
   const user = await userModel.create({name,email,Password:hashedPasswrod,Phone:encryptedData,iv_phone:iv,age})
   await session.commitTransaction();
   return user
    }catch(err){
 await session.abortTransaction();
 await session.endSession();
 throw err;
    }
}

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
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}