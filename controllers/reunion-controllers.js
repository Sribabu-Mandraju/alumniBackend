import Reunion from "../modals/reunion.modal.js" 


export const createReunion = async (req, res) => {
    try {
        const newReunion = new Reunion(req.body);
        await newReunion.save();
        res.status(201).json({ message: "Reunion created successfully", newReunion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAllReunions = async (req, res) => {
    try {
        const reunions = await Reunion.find();
        res.status(200).json(reunions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getReunionById = async (req, res) => {
    try {
        const reunion = await Reunion.findById(req.params.id);
        if (!reunion) return res.status(404).json({ message: "Reunion not found" });
        res.status(200).json(reunion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateReunion = async (req, res) => {
    try {
        const updatedReunion = await Reunion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReunion) return res.status(404).json({ message: "Reunion not found" });

        res.status(200).json({ message: "Reunion updated successfully", updatedReunion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteReunion = async (req, res) => {
    try {
        const deletedReunion = await Reunion.findByIdAndDelete(req.params.id);
        if (!deletedReunion) return res.status(404).json({ message: "Reunion not found" });

        res.status(200).json({ message: "Reunion deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const rsvpReunion = async (req, res) => {
    try {
        const reunion = await Reunion.findById(req.params.id);
        if (!reunion) return res.status(404).json({ message: "Reunion not found" });

        if (!reunion.attendees.includes(req.body.userId)) {
            reunion.attendees.push(req.body.userId);
            await reunion.save();
        }

        res.status(200).json({ message: "RSVP successful", reunion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
