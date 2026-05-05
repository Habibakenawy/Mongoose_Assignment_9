import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,"title is mandatory"],
            validate:{
                validator:function (value){
               return value!=value.toUpperCase();
                },
                message:"Title cannot be entirely uppercase!"
            }
        },
        content:{
            type:String,
            required:[true,"content in mandatory"]
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,ref:'User'
            ,required:true
        }
    },{
        collection:"NotesData",
        timestamps:true
    }
)

export const userModel = mongoose.models.Notes || mongoose.model("Notes",notesSchema)