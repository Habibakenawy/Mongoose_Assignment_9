import { Router } from "express";
import { successResponse } from "../../common/utils/response/success.response.js";
import { signup,login,updateUser,deleteUser,getUserData } from "./user.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router=Router()


router.post("/signup",async (req,res,next)=>{
    const result= await signup(req.body);
    return successResponse({res,message:"User added successfully.",status:201,data:{result}});
})

router.get("/login",async (req,res,next)=>{
    const result= await login(req.body);
    return successResponse({res,message:"Login successful",status:200,data:{result}});
})

router.patch("/",authMiddleware,async (req,res,next)=>{
    const result= await updateUser(req.user.userId,req.body);
    return successResponse({res,message:"User Updated",status:200,data:{result}});
})

router.delete("/",authMiddleware,async (req,res,next)=>{
    const result= await deleteUser(req.user.userId);
    return successResponse({res,message:"User Deleted",status:200,data:{result}});
})

router.get("/",authMiddleware,async (req,res,next)=>{
    const result= await getUserData(req.user.userId);
    return successResponse({res,message:"User data retrieved successfully",status:200,data:{result}});
})

export default router