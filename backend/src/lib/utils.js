import jwt from "jsonwebtoken";


export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"

    })

    //Send token in cookies
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 10000, //in milliseconds
        httpOnly : true ,//prevents XSS attacks cross-site scriptin attakcs
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" 
    })

    return token;
}