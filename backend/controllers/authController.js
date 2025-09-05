const User = require('../models/userModel');
const apiError = require('../utils/ApiError');
module.exports.register = async function(req,res,next) {

    try {
        const userData = req.body;
        console.log("userdata",userData.email);
        const isEmail = await User.findOne({email:userData.email});
        
        if(isEmail){
            throw new apiError('user already registed',400)
      
        }

        let user = new User(userData);
        await user.save();
         return res.status(201).json({
            success: true,
            message: "user succesfully registed"
          })
        
    } catch (error) {
         next(error);
    
    }
    
}

module.exports.login = async function(req,res,next) {
    try {
        const {email ,password} = req.body;
        console.log("req",req.body)
        if(!email || !password){
             throw new apiError("please enter email and password",400)

        }
       let isUser = await User.findOne({email:email});
       if(!isUser){
             throw new apiError("Email not found",404)
       }
        
       let matchPassword = await isUser.ComparePassword(password)
       if(!matchPassword){
         throw new apiError("Invalid credintal",400)
       }
       const token = isUser.GenerateToken();
       console.log("token",token)
       return res.status(200).json({
        message: "Sucessfully Login",
        token:token
       })

    } catch (error) {
         next(error);
    }
    
    
}


module.exports.getOne = async function(req,res,next) {
    try {
        const userid = req.user.id;
       
       let isUser = await User.findById(userid);
       if(!isUser){
        throw new apiError("User not found",404)
       }
        
       return res.status(200).json({
        message: "Sucessfully get user",
        user: isUser
       })

    } catch (error) {
          next(error);
    }
    
    
}