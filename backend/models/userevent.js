import mongoose from "mongoose";

const userEventSchema= new mongoose.Schema({
    event:{
        type:Number,
        required:true
    },
    total_donations :{
        type: Number,
        required:true
    },
    recency :{
        type:Number,
        required:true
    },
    bloodType:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    urgency:{
        type:String,
        required:true
    },
    distance:{
        type:Number,
        required:true
    },
    willingness_level:{
        type:Number,
        required: true
    }
})

const UserEvent = mongoose.model("UserEvent",userEventSchema);
export default UserEvent;