import User from '../models/user.schema'
import JWT from 'jsonwebtoken'
import asyncHandler from '../services/asynchandler'
import CustomError from '../utils/customError'
import config from '../index'

export const isLoggedIn = asyncHandler(async(req, res, next) => {
    let token;

    if(req.cookies.token ||
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
         )) {
            token. req.cookies.token || req.headers.authorization.split(" ")[1] // [0] has "Bearer"
         }

    if(!token) {
        throw new CustomError("Not authorized to access", 401)
    }

    try {
        const decJWTpayload = JWT.verify(token, config.JWT_SECRET);
        // _id, find user with id, set this in user
        req.user = await User.findById(decJWTpayload._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not authorized to access this route", 401)
    }
})