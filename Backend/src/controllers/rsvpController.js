import RSVP from "../../models/RSVP.js";
import Event from "../../models/Event.js";

export const getRsvp = async (req, res) => {

  const { id } = req.params;
  try {
    const rsvp = await RSVP.findById(id).populate("eventId"); // ← pulls event data in

    if (!rsvp) return res.status(404).json({ message: "Invitation not found" });

    res.status(200).json({
      rsvp,
      event: rsvp.eventId,
    });
  } catch (err) {
    console.error("RSVP fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};
