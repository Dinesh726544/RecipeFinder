import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //we use validateBeforeSave = false because when we save this new entry in db the mongoose shema will through an error and says required fields must be require before saving new entry on user object therefore we set it to false

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  console.log(req.file);

  let avatarLocalPath;
  if (req.file) {
    avatarLocalPath = req.file.path;
  }

  console.log(avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);

  if (!avatar)
    throw new ApiError(
      400,
      "Something went wrong while uploading avatar on cloudinary!!"
    );

  const user = await User.create({
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //removing username
  const { email, password } = req.body;
  console.log(email);

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  //   console.log(user);

  // const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)  //TODO: try to pass whole user object
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  ); //TODO: try to pass whole user object

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  console.log("req.file :: ", req.file);

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  console.log(avatarLocalPath);

  //TODO: delete old image - assignment

  //req.user was passed though verifyJwt and we got the user then we found the avarat
  if (req.user.avatar.length > 0) {
    const avatarUrl = req.user.avatar;

    const getPublicIdFromUrl = (url) => {
      // Extract the part after /upload/ and remove the file extension
      const parts = url.split("/");
      const publicIdWithExtension = parts[parts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0]; // Removing the file extension
      return publicId;
    };

    //URL
    const imageUrl = avatarUrl;

    // Get public_id from URL
    const publicId = getPublicIdFromUrl(imageUrl);
    console.log("publicId :: ", publicId);

    deleteImageFromCloudinary(publicId);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserAvatar,
};
