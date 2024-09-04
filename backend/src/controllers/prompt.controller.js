import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptHistory } from "../models/promptHistory.model.js";

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



  
  
  await PromptHistory.create({
    owner : req.user._id,
    prompt,
    generatedResponse : formatedText
  })

  return res
    .status(201)
    .json(new ApiResponse(200, formatedText, "Generated!"));
});

export { Createprompt };
