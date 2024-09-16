import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prompt } from "../models/prompt.model.js";
import moment from "moment";

const Createprompt = asyncHandler(async (req, res) => {
  //get prompt from user
  // const { Ingredients,"Meal Type","Cuisine Preference","Cooking Time",Complexity } = req.body;
  const { prompt } = req.body;

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(
    `generate Recipe having these points:-\n ${prompt}`
  );
  // console.log(result.response.text());

  if (!result) {
    throw new ApiError(500, "unable to generate!!");
  }

  //formating the string
  function formatRecipeString(recipeString) {
    // Replace **text** with <strong>text</strong>
    let formattedString = recipeString
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Replace **text** with <strong>text</strong>
      .replace(/\n\n/g, "<br /><br />") // Replace double newlines with <br /><br />
      .replace(/\n/g, "<br />"); // Replace single newline with <br />

    // Wrap any text that's not inside tags in <span></span>
    formattedString = formattedString.replace(
      /(<strong>.*?<\/strong>)(.*?)(<br \/>|$)/g,
      function (match, strong, text, br) {
        if (text.trim()) {
          return `${strong}<span>${text.trim()}</span>${br}`;
        }
        return `${strong}${br}`; // Return <strong> without changes if no text follows
      }
    );

    return formattedString;
  }

  const formatedText = formatRecipeString(result.response.text());

  await Prompt.create({
    owner: req.user._id,
    prompt,
    generatedResponse: formatedText,
  });

  return res.status(201).json(new ApiResponse(200, formatedText, "Generated!"));
});

// const getPromptHistory = asyncHandler(async(req,res) => {

//   const responseHistory = await Prompt.find({
//     owner : req.user?._id
//   })

//   const result = responseHistory.map(item => ({
//     promptId : item._id,
//     prompt: item.prompt,
//     generatedResponse: item.generatedResponse,
//     createdAt : moment(new Date(item.createdAt)).format('YYYY-MM-DD HH:mm:ss')
//   }));

//   return res
//     .status(200)
//     .json(new ApiResponse(200,result,"history fached!!"))
// })

const getPromptHistory = asyncHandler(async (req, res) => {
  //given query
  const { query } = req.query;

  let { page = 1, limit = 5 } = req.query;
  page = parseInt(page);

  const filter = {};
  if (query) filter.prompt = { $regex: query, $options: "i" };
  if (req.user) filter.owner = req.user?._id;

  console.log(filter);

  const skip = (page - 1) * limit;

  const responseHistory = await Prompt.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .exec();

  const totalPromptCount = await Prompt.countDocuments(filter)
  const totalPages = Math.ceil(totalPromptCount / limit);

  console.log(responseHistory);

  const result = responseHistory.map((item) => ({
    promptId: item._id,
    prompt: item.prompt,
    generatedResponse: item.generatedResponse,
    createdAt: moment(new Date(item.createdAt)).format("YYYY-MM-DD HH:mm:ss"),
  }));

  return res.status(200).json(new ApiResponse(200, {result,totalPages}, "history fached!!"));
});

const deletePromptHistoryById = asyncHandler(async (req, res) => {
  const { promptId } = req.params;
  const prompt = await Prompt.findByIdAndDelete(promptId);

  if (!prompt) {
    throw new ApiError(400, "prompt id doesnot exist or wrong!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "", "prompt deleted successfully"));
});

const deleteAllPromptHistory = asyncHandler(async (req, res) => {
  console.log(req.user._id);

  await Prompt.deleteMany({ owner: req.user?._id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "cleared all user history!!"));
});

export {
  Createprompt,
  getPromptHistory,
  deletePromptHistoryById,
  deleteAllPromptHistory,
};
