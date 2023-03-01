import User from '../models/user.schema'
import asyncHandler from '../services/asynchandler'
import CustomError from '../utils/customError'
import mailHelper from '../utils/mailHelper'
import crypto from 'crypto'

export const cookieOptions = {
    expires: new Date(Date.now() + 3*24*60*60*1000),
    httpOnly: true,
}

/*
* @SIGNUP *
* @route http://localhost:3000/api/auth/signup * 
* @description User signup controller for creating a new user * 
* @paramters name email password, ...
* @returns User Object  * 
*  * 
*/

// passing async for extra check
export const signUp = asyncHandler(async (req, res, next) => {

    const {name, email, password} = req.body

    if(!name || !email || !password) {
        throw new CustomError ("please fill all fields", 400)
    }

    const existingUser = await User.findOne({email})

    if(existingUser) {
        throw new CustomError("User already exists", 400)
    }

    const user = await User.create({
        name,
        email,
        password, //SAve operations also encrypts
    })

    const token =  user.getJwtToken()
    console.log(user);
    user.password = undefined;

    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success:true,
        token,
        user
    })
})

/*
* @LOGIN *
* @route http://localhost:3000/api/auth/login * 
* @description User login controller * 
* @paramters email password, ...
* @returns User Object  * 
*  * 
*/
export const logIn = asyncHandler (async(req, res, next) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new CustomError ("please fill all fields", 400)
    }

    const user = await User.findOne({email}).select("+password -name")

    if(user) {
        throw new CustomError("Invalid credentials", 400)
    }

    const passwordMatch = await user.comparePassword(password)

    if(!passwordMatch) {
        throw new CustomError("Password mis match", 400)
    }

    const token = user.getJwtToken()
    user.password - undefined
    res.cookie("token" , token, cookieOptions)

    return res.status(200).json({
        success: true,
        token,
        user
    })

})

/*
* @LOGOUT *
* @route http://localhost:3000/api/auth/logout * 
* @description User logout controller * 
* @paramters , ...
* @returns success  * 
*  * 
*/
export const logOut = asyncHandler (async(_req, res, next) => {

    // res.clearCookie()
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success: true,
        message:"Logged out"
    })
})

/*
* @FORGOT_PASSWORD *
* @route http://localhost:3000/api/auth/password/forgot * 
* @description User submits email for password reset by generating token* 
* @paramters , email
* @returns success  * 
*  * 
*/

export const forgotPassword = asyncHandler(async(req, res) => {
    const {email} = req.body
    // TODO: email validation
    const user = await User.findOne({email})
    if(user) {
        throw new CustomError('User not found', 404)
    }
    const resetToken = user.generateForgotPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get("host")}api/auth/password/reset/${resetToken}`

    const emailText = "Password reset link \n\n {resetUrl} \n\n"
    try {
        await mailHelper({
            email: user.email,
            subject:"Reset password",
            text: text,
        })
        res.status(200).json({
            success:true,
            message: "Email sent to ${user.email}"
        })
    } catch (error) {
        // rollback
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined
        await user.save({validateBeforeSave: false})
        
        throw new CustomError(error.message || "Email message failed", 500)
    }
})

/*
* @RESET_PASSWORD *
* @route http://localhost:3000/api/auth/password/reset/:resetPasswordToken * 
* @description User resets password using url token* 
* @parameters token from url, password and confirm password
* @returns success  User object* 
*  * 
*/

export const resetPassword = asyncHandler(async(req, res) => {
    const {token: resetToken } = req.params
    const {password, confirmPassword} = req.body

    const resetPasswordToken = crpto.createHash('sha256')
    .update(resetToken)
    .digest('hex')

    const user = await User.findOne({forgotPassword: resetPasswordToken,
    forgotPasswordExpiry: {$gt: Date.now()}})

    if(!user){
        throw new CustomError("Password token invalid or expired", 400)
    }

    if(password != confirmPassword) {
        throw new CustomError("Password and confirm password mis-match", 400)
    }

    user.password = password
    user.forgotPassword = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    const token = user.getJwtToken()
    user.password = undefined
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success:true,
        user
    })
})

// TODO: Create controller for change password

/*
* @GET_PROFILE *
* @REQUEST_TYPE: GET*
* @route http://localhost:3000/api/auth/profile * 
* @description Check for token and get user info into req object* 
* @parameters 
* @returns success  User object* 
*  * 
*/

export const getProfile = asyncHandler(async(req, _res, _next) => {
    const {user} = req
    if(!user) {
        throw new CustomError("USer not found", 404)
    }
    res.status(200).json({
        success:true,
        user
    })
})

// TODO: Update extensions in devcontainers