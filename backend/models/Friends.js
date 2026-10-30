const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
    
    sender :{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver :{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status : {
        type : String,
        enum : ["pending", "accepted"],
        default : "pending"
    },
    createdAt: {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
});

module.exports = mongoose.model("Friends", friendsSchema);