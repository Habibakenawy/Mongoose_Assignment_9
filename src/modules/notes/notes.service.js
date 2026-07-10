import { NotFoundException ,UnauthorizedException} from "../../common/utils/index.js";
import { notesModel } from "../../DB/model/notes.model.js";
import mongoose from "mongoose";

// NO SESSION NEEDED IF IT IS ONLY A ONE WRITE OPERATION
//Transactions are meant to protect data integrity across multiple dependent write operations (e.g., deducting money from User A's balance and adding it to User B's balance)



export const createNote = async (id, body) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { title, content } = body;
  try {
    const note = await notesModel.create({
      title,
      content,
      userId: id,
    });
    await session.commitTransaction();
    return note;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

export const updateNote = async (id, body, notesId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { title, content } = body;
  try {
    const found_note = await notesModel.findById(notesId);
    if (!found_note) {
      throw NotFoundException({ message: "Note not found" });
    }

    if (found_note.userId.equals(id)) {
      const note = await notesModel.findOneAndUpdate(
        { _id: notesId },
        { title, content, $inc: { __v: 1 } },
        { session, new: true },
      );
      await session.commitTransaction();
      return note;
    } else {
      throw UnauthorizedException({ message: "You are not the owner" });
    }
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

export const replaceNote = async (id, body, notesId) => {
  const { title, content,userId } = body;
  try {
    const found_note = await notesModel.findById(notesId);
    if (!found_note) {
      throw NotFoundException({ message: "Note not found" });
    }

    if (userId===id) {
      const note = await notesModel.findOneAndUpdate(
        { _id: notesId },
        { title, content, $inc: { __v: 1 } },
        {new: true }
      );
      return note;
    } else {
      throw UnauthorizedException({ message: "You are not the owner" });
    }
  } catch (err) {
    throw err;
  }
};

export const updateAllTitles = async (id, body) => {
  const { newTitle} = body;
  try {
    const found_notes = await notesModel.updateMany({userId:id},{$set:{title:newTitle}});
    console.log(found_notes)
    if (found_notes.matchedCount==0) {
      throw NotFoundException({ message: "No note found" });
    }

  } catch (err) {
    throw err;
  }
};

export const deleteNote = async (id, notesId) => {
  try {
    const found_note = await notesModel.findById(notesId);
    if (!found_note) {
      throw NotFoundException({ message: "Note not found" });
    }

    if (found_note.userId.toString()===id) {
     const note = await notesModel.findByIdAndDelete(notesId);
      return note;
    } else {
      throw UnauthorizedException({ message: "You are not the owner" });
    }
  } catch (err) {
    throw err;
  }
};

//offset for pagination = (page-1) * (size or limit)



export const getNotes = async (id,query) =>{
let {page,limit} = query;
page = parseInt(page) || 1;
limit = parseInt(limit)|| 2;
const offset = (page-1)*limit;
const notes = await notesModel.find({userId:id}).skip(offset).limit(limit).sort({createdAt:-1});
return notes;
}

export const getNoteById = async (id, notesId) => {
  try {
    const found_note = await notesModel.findById(notesId);
    if (!found_note) {
      throw NotFoundException({ message: "Note not found" });
    }

    if (found_note.userId.toString()===id) {
      return found_note;
    } else {
      throw UnauthorizedException({ message: "You are not the owner" });
    }
  } catch (err) {
    throw err;
  }
};