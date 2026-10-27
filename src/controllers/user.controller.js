import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from"../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser =asyncHandler(async(req,res)=>{
    
    const {fullName,email,username,password}=req.body
    console.log("fullname:",fullName);
    console.log("email:",email);
    if(fullName==""){
        throw new ApiError(400,"fullname is required")
    }
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"username or email already exist")
    }
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")

    }
   const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url ||"",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select("-password -refreshtoken")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while regestring the user ")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfully")
    )
})
const loginUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body
    if(!username || !email ){
        throw new ApiError(400,"username or email is required   ")
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw  new ApiError(404,"user does not exist")
    }
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Password")
    }
})
export  {registerUser,loginUser}