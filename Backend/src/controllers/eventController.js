import { Event } from "../../models";

export const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const invitation = await Event.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    res.status(200).json(invitation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
