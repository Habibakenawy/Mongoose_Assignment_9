import { Router } from "express";
import { successResponse } from "../../common/utils/response/success.response.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { createNote,updateNote } from "./notes.service.js";
const router=Router()


router.post('/',authMiddleware,async(req,res,next)=>{
const result= await createNote(req.user.userId,req.body);
return successResponse({res,message:"Note Created",status:201,data:{result}});
})

router.patch('/:notesId',authMiddleware,async(req,res,next)=>{
const result= await updateNote(req.user.userId,req.body,req.params.notesId);
return successResponse({res,message:"Note updated",status:200,data:{result}});
})









export default router