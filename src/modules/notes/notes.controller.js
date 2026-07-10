import { Router } from "express";
import { successResponse } from "../../common/utils/response/success.response.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { createNote,updateNote,replaceNote,updateAllTitles,deleteNote,getNotes, getNoteById,getNoteByContent,getAllNotes} from "./notes.service.js";
const router=Router()


router.post('/',authMiddleware,async(req,res,next)=>{
const result= await createNote(req.user.userId,req.body);
return successResponse({res,message:"Note Created",status:201,data:{result}});
})

router.patch('/all',authMiddleware,async(req,res,next)=>{
const result= await updateAllTitles(req.user.userId,req.body);
return successResponse({res,message:"All notes updated",status:200,data:{result}});
})

router.get('/paginate-sort',authMiddleware,async(req,res,next)=>{
const result= await getNotes(req.user.userId,req.query);
return successResponse({res,message:"Notes found",status:200,data:{result}});
})

router.get('/note-by-content',authMiddleware,async(req,res,next)=>{
const result= await getNoteByContent(req.user.userId,req.query);
return successResponse({res,message:"Notes found",status:200,data:{result}});
})

router.get('/note-with-user',authMiddleware,async(req,res,next)=>{
const result= await getAllNotes(req.user.userId);
return successResponse({res,message:"Notes found",status:200,data:{result}});
})


router.patch('/:noteId',authMiddleware,async(req,res,next)=>{
const result= await updateNote(req.user.userId,req.body,req.params.noteId);
return successResponse({res,message:"Note updated",status:200,data:{result}});
})



router.put('/replace/:noteId',authMiddleware,async(req,res,next)=>{
const result= await replaceNote(req.user.userId,req.body,req.params.noteId);
return successResponse({res,message:"Note replaced",status:200,data:{result}});
})


router.delete('/:noteId',authMiddleware,async(req,res,next)=>{
const result= await deleteNote(req.user.userId,req.params.noteId);
return successResponse({res,message:"Note deleted",status:200,data:{result}});
})

router.get('/:id',authMiddleware,async(req,res,next)=>{
const result= await getNoteById(req.user.userId,req.params.id);
return successResponse({res,message:"Note found",status:200,data:{result}});
})





export default router