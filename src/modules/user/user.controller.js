import { Router } from "express";
import { successResponse } from "../../common/utils/response/success.response.js";
import { signup,login } from "./user.service.js";
//import { profile } from "./user.service.js";
const router=Router()

router.get("/" , (req,res,next)=>{
  //  const result  = profile(req.query.id)
    return res.status(200).json({message:"Profile" , result})
})

router.post("/signup",async (req,res,next)=>{
    const result= await signup(req.body);
    return successResponse({res,message:"User added successfully.",status:201,data:{result}});
})


router.get("/login",async (req,res,next)=>{
    const result= await login(req.body);
    return successResponse({res,message:"Login successful",status:200,data:{result}});
})
export default router