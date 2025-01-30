import Donation from "../modals/donations.js";
import Alumni from "../modals/alumni.modal.js";

// Create a donation and update Alumni reference
export const createDonation = async (req, res) => {
  try {
    const { donationName, purpose, initiatedBy, totalFund, contributors } = req.body;
    
    // Ensure 'initiatedBy' is a valid Alumni ID
    const alumni = await Alumni.findById(initiatedBy);
    if (!alumni) {
      return res.status(404).json({ error: "Initiating alumni not found" });
    }

    const donation = new Donation({
      donationName,
      purpose,
      initiatedBy,
      totalFund,
      contributors,  // Including contributors while creating the donation
    });

    await donation.save();

    // Add the donation reference to the initiating alumni's donations array
    alumni.donations.push(donation._id);
    await alumni.save();

    // Add donation references to each contributor
    for (const contributor of contributors) {
      const contributorAlumni = await Alumni.findById(contributor.alumni);
      if (!contributorAlumni) {
        return res.status(404).json({ error: `Contributor alumni ${contributor.alumni} not found` });
      }
      contributorAlumni.donations.push(donation._id);
      await contributorAlumni.save();
    }

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all donations with populated references
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("initiatedBy", "username email") // Fetch initiator details
      .populate("contributors.alumni", "username email"); // Fetch contributor details

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a donation and maintain Alumni references
export const updateDonation = async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json(updatedDonation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a donation and remove its reference from Alumni
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Remove donation reference from the initiating Alumni
    await Alumni.findByIdAndUpdate(donation.initiatedBy, {
      $pull: { donations: donation._id },
    });

    // Remove donation references from contributors
    for (const contributor of donation.contributors) {
      await Alumni.findByIdAndUpdate(contributor.alumni, {
        $pull: { donations: donation._id },
      });
    }

    await Donation.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a contributor to a donation and update their reference in Alumni
export const addContributor = async (req, res) => {
  try {
    const { alumniId, amount } = req.body;
    const { donationId } = req.params;

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        $push: { contributors: { alumni: alumniId, amount } },
        $inc: { totalFund: amount },
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Add donation reference to the alumni's donations array
    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      return res.status(404).json({ error: "Alumni not found" });
    }
    alumni.donations.push(donationId);
    await alumni.save();

    res.status(200).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
