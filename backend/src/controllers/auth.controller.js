import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req,res)=>{
    console.log("Request Body:", req.body); // Log request body for debugging

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

export const login = (req,res)=>{
    res.send("login route")
};
export const logout = (req,res)=>{
    res.send("loggout route")
};