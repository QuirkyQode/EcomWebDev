import mongoose from "mongoose";
import AuthRoles from '../utils/authRoles'
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from "crypto"
import { config } from "dotenv";


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [50, "Name must be < 50 chars"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "PAssword must be atleast 8 chars"],
        select: false,  // used in time of login
    },
    role: {
        type: String,
        enum: Object.values(AuthRoles), // 
        default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
}, {
    timestamps: true,
});

// 1. Encrypt password before saving
userSchema.pre('save', async function(next) {
    if(!this.isModified("password"))  return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
}) //Always use function instead of arrow since we are using "this"

// 2. add more features directly to schema
userSchema.methods = {
    // compare password
    comparePassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    },
    // Generate JWT token
    getJwtToken: function () {
        return JWT.sign({
            _id: this._id,
            role: this.role,
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRY
        })
    },
    generateForgotPasswordToken: function () {
        const forgotToken = crypto.randomBytes (20).toString('hex')
        this.forgotPasswordToken = crypto.createHash("sha256")
        .update(forgotToken)
        .digest("hex")
        this.forgotPasswordExpiry = Date.now() + 20 * 60*1000 
        return forgotToken;
    }
}


export default mongoose.model("User", userSchema);

