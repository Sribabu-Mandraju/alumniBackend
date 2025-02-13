import mongoose from "mongoose";
const reunionSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    date:{type:Date,required:true},
    location:{type:String,required:true},
    attendees:[{type:mongoose.Schema.Types.ObjectId,ref:"Alumni"}],
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"Alumni",required:true}
},{timestamps:true});
const Reunion=mongoose.model("Reunion",reunionSchema);
export default Reunion;
