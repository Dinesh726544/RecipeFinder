import mongoose,{Schema} from "mongoose";
import { User } from "./user.model.js";

const promptSchema = new Schema({
  owner : {
    type : Schema.Types.ObjectId,
    ref : User
  },
  prompt : {
    type : String
  },
  generatedResponse : {
    type : String
  }
},{timestamps : true})

export const Prompt = mongoose.model("Prompt",promptSchema)