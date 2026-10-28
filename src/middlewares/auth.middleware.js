import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jwt'

export const verifyJWT =asyncHandler(async(req,res,next)=>{

    try {
        const token=req.cookies.accesstoken || req.header("Authorization")?.replace("Bearer ","")
        if(!token ){
            throw new ApiError(401,"unauthorized request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findBy(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Invalid access token")
    
        }
        req.user=user;
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid access token")
    }
    req.user=user
    next()

}) 