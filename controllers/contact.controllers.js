import Contact from "../modals/contact.modal.js";

export const submitContactForm=async(req,res)=>{
    try{
    const{name,email,message}=req.body;
    const newContact=new Contact({name,email,message});
    await newContact.save();
    res.status(201).json({message:"Message sent successfully",newContact});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};

export const getAllContacts=async(req,res)=>{
    try{
     const contacts=await Contact.find();
     res.status(200).json(contacts);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}


export const deleteContactMessage=async(req,res)=>{
    try{
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) return res.status(404).json({ message: "Message not found" });

        res.status(200).json({ message: "Message deleted successfully" });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}