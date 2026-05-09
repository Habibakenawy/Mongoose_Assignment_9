import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name is mandatory"]
        },
        email:{
            type:String,
            unique:true,
            required:[true,"Email in mandatory"]
        },
        Password:{
          type:String,
          required:[true,"Password in mandatory"]
        },
        Phone:{
          type:String,
          required:[true,"Phone in mandatory"]
        },
        age:{
            type:Number,
            min:18,
            max:60
        }
    },{
        collection:"UserData",
        optimisticConcurrency: true
    }
)

export const userModel = mongoose.models.User || mongoose.model("User",userSchema)