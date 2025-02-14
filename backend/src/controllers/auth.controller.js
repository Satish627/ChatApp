import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudnary from "../lib/cloudnary.js";

export const signup = async (req,res)=>{

    const {fullName,email, password } = req.body
    try{
        if(!email || !fullName || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: "User already exists"})
        }

        //Hash password
        const salt =await bcrypt.genSalt(10);
        const hashedPassword =await  bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        })
        if(newUser){
            //Generate JWT
            generateToken(newUser._id, res )
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else{
            return res.status(400).json({message: "Invalid user"})
        }

    }
    catch(error){
        console.log("Error in signup controller " , error.message)
        res.status(500).json({message: "Internal server error"})
    }
};

export const login =async (req,res)=>{
    const {email, password} = req.body

    try{
    const user  = await User.findOne({email});
    if(!user){
       return res.status(400).json({message: "Invalid credentials"})
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid credentials"})
    }
    generateToken(user._id, res)
    res.status(200).json({
        id: user._id,
        email:user.email,
        fullName: user.fullName,
        profilePic : user.profilePic
    })

    }
    catch(error){
        console.log("Error in login controller: ", error.message)
        res.status(500).json({message:"Internal server error"})
    }
};
export const logout = (req,res)=>{
    try{
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"})
    }
    catch(error){

        console.log("Error in logout controller: ", error.message)
        res.status(500).json({message:"Internal server error"})
    }
};

export const updateProfile =async (req,res)=>{
    try{
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"})
        }

        const uploadResponse = await cloudnary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        },
        {
            new:true
        }
    )
    res.status(200).json(updateUser)
    }
    catch{
        console.log("Error in update profile controller: ", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}


export const checkAuth = async (req, res) =>{
    try{
        res.status(200).json(req.user)
    }
    catch(error){
        console.log("Error in checkauth controller: ", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}