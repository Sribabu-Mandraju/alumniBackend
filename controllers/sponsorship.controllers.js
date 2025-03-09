import Sponsorship from "../modals/sponsorship.modal.js";
export const createSponsorship=async(req,res)=>{
    try{
    const newSponsorship=new Sponsorship(req.body);
    await newSponsorship.save();
    res.status(201).json({message:"sponsorship is created succesfully",newSponsorship});

    }catch(error){
        res.status(500).json({error:error.message});
    }
}


export const getAllSponsorships=async(req,res)=>{
    try{
 const sponsorships=await Sponsorship.find()
 res.status(200).json(sponsorships);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}


export const getSponsorshipById=async(req,res)=>{
    try{

   
    const sponsorship=await Sponsorship.findById(req.params.id);
    if(!sponsorship) return res.status(404).json({message:"sponsorship not found"});
    res.status(200).json(sponsorship); }
    catch(error){
        res.status(500).json({error:error.message});
    }

}


export const updateSponsorship=async(req,res)=>{
    try{
   const updatedSponsorship=await Sponsorship.findByIdAndUpdate(req.params.id);
   if(!updatedSponsorship) return res.status(404).json({message:"sponsorship not found"});
   res.status(200).json({message:"sponsorship updated successfully",updatedSponsorship})
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}


export const deleteSponsorship=async(req,res)=>{
    try{
    const deletedSponsorship=await Sponsorship.findByIdAndDelete(req.params.id);
    if(!deletedSponsorship) return res.status(404).json({message:"sponsorhip not found"});
    res.status(200).json({message:"sponsorship deleted succesfully",deletedSponsorship})
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
    
}


export const verifySponsorship=async(req,res)=>{
    try{
        const sponsorship = await Sponsorship.findById(req.params.id);
        if (!sponsorship) return res.status(404).json({ message: "Sponsorship not found" });

        sponsorship.isVerified = true;
        await sponsorship.save();

        res.status(200).json({ message: "Sponsorship verified successfully", sponsorship });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}