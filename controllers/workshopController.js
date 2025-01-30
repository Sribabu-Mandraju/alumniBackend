import Workshop from "../modals/workshops.js";

// Create a workshop
export const createWorkshop = async (req, res) => {
    try {
      const { title, description, time, organisedBy } = req.body;
      
      // Validate inputs
      if (!title || !description || !time || !organisedBy) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const workshop = await Workshop.create(req.body);
      res.status(201).json(workshop);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  

// Get all workshops
export const getWorkshops = async (req, res) => {
    try {
      const workshops = await Workshop.find();
      res.status(200).json(workshops);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Update a workshop
export const updateWorkshop = async (req, res) => {
    try {
      const { title, description, time, organisedBy } = req.body;
      
      // Validate inputs
      if (!title || !description || !time || !organisedBy) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const updatedWorkshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedWorkshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
  
      res.status(200).json(updatedWorkshop);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// Delete a workshop
export const deleteWorkshop = async (req, res) => {
    try {
      const workshop = await Workshop.findByIdAndDelete(req.params.id);
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      res.status(200).json({ message: "Workshop deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  