const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = new mongoose.Schema({
    
      name: {
        type: String,
        require:true
      },
      email: {
        type:String,
        required:true,
        unique:true  
      },
      password: {
        type:String,
        require:true
      },
      role: {
        type: String,
        enum: ['User','Admin']
      },
     
},{
    timestamps:true
}
)


userModel.pre('save',async function() {
   if(!this.isModified("password")) return next();
       this.password = await bcrypt.hash(this.password,10)  
      
})

userModel.methods.ComparePassword = async function(password) {
  // console.log("user",this.password);
     return await bcrypt.compare(password,this.password)
}

userModel.methods.GenerateToken = function() {
   console.log("user",this)
    return jwt.sign({id:this._id,email:this.email,role:this.role},process.env.SecreteKey,{expiresIn:'24h'})  
}
const UserModel = mongoose.model('User',userModel)
module.exports = UserModel;