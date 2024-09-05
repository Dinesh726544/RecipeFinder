import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prompt } from "../models/prompt.model.js";

const Createprompt = asyncHandler(async (req, res) => {
  //get prompt from user
  const { prompt } = req.body;

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  console.log(result.response.text());

  if (!result) {
    throw new ApiError(500, "unable to generate!!");
  }




  //converting all \n into <br> tag and **text** to <h3>text</h3>
  function replaceNewlinesWithBreaks(text) {
  // Replace **text** with <h3>text</h3>
  text = text.replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>');

  // Replace \n with <br>
  return text.replace(/\n/g, '<br>');
  }
  
  const formatedText = replaceNewlinesWithBreaks(result.response.text());



  
  
  await Prompt.create({
    owner : req.user._id,
    prompt,
    generatedResponse : formatedText
  })

  return res
    .status(201)
    .json(new ApiResponse(200, formatedText, "Generated!"));
});

const getPromptHistory = asyncHandler(async(req,res) => {
  const responseHistory = await Prompt.find({
    owner : req.user?._id
  })

  // console.log(responseHistory);
  

  const result = responseHistory.map(item => ({
    prompt: item.prompt,
    generatedResponse: item.generatedResponse
  }));

  return res
    .status(200)
    .json(new ApiResponse(200,result,"history fached!!"))
})

const deletePromptHistoryById = asyncHandler(async(req,res) => {
  const {promptId} = req.params
  const prompt = await Prompt.findByIdAndDelete(promptId)

  if (!prompt) {
    throw new ApiError(400, "prompt id doesnot exist or wrong!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "", "prompt deleted successfully"));

})

const deleteAllPromptHistory = asyncHandler(async(req,res) => {

  console.log(req.user._id);
  
  await Prompt.deleteMany({owner : (req.user?._id)})

  return res
    .status(200)
    .json(new ApiResponse(200,{},"cleared all user history!!"))
})


export { Createprompt,getPromptHistory,deletePromptHistoryById,deleteAllPromptHistory };
