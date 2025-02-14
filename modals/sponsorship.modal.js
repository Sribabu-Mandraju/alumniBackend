import mongoose from "mongoose";
const sponsorshipSchema=new mongoose.Schema(
    {
    title:{type:String,required:true},
    description:{type:String,required:true},
    registrationDeadline:{type:Date,required:true},
    isActive:{type:Boolean,default:true},
    isVerified:{type:Boolean,default:false},
    links:[{type:String}]
    },{timestamps:true}
);
const sponshorship=mongoose.modelNames("sponsorship",sponsorshipSchema);
export default sponshorship;