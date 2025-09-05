const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
        name: {
            type: String, 
            required: true
            },

       owner: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
         }
},
{
    timestamps:true
}
);

const  Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;