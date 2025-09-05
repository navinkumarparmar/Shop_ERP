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
            return res.status(400).json({
                message:"please enter email and password"
            })
        }
       let isUser = await User.findOne({email:email});
       if(!isUser){
        return res.status(404).json({
            message:"Email not found"
        })
       }
        
       let matchPassword = await isUser.ComparePassword(password)
       if(!matchPassword){
        return res.status(400).json({
            message:"Invalid credintal"
        })
       }
       const token = isUser.GenerateToken();
       console.log("token",token)
       return res.status(200).json({
        message: "Sucessfully Login",
        token:token
       })

    } catch (error) {
           console.log('errrorr',error)
        return res.status(500).json({
            message: "something went wrong"
        })
        
    }
    
    
}


module.exports.getOne = async function(req,res,next) {
    try {
        const userid = req.user.id;
       
       let isUser = await User.findById(userid);
       if(!isUser){
        return res.status(404).json({
            message:"User not found"
        })
       }
        
       return res.status(200).json({
        message: "Sucessfully get user",
        user: isUser
       })

    } catch (error) {
           console.log('errrorr',error)
        return res.status(500).json({
            message: "something went wrong"
        })
        
    }
    
    
}