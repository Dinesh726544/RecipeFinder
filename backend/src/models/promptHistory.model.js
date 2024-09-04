import mongoose,{Schema} from "mongoose";
import { Prompt } from "./prompt.model.js";

const promptHistorySchema = new Schema({
  owner : {
    type : Schema.Types.ObjectId,
    ref : Prompt
  },
  prompt : {
    type : String
  },
  generatedResponse : {
    type : String
  }
},{timestamps : true})

export const PromptHistory = mongoose.model("PromptHistory",promptHistorySchema)