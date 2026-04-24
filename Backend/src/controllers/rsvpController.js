import RSVP from "../../models/RSVP.js";
import Event from "../../models/Event.js";
import mongoose from "mongoose";
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

export const updateRSVP = async (req, res) => {
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

export const getRSVPbyStatus = async (req, res) => {
  const { status, id } = req.params;
  try {
    const rsvps = await RSVP.find({
      eventId: new mongoose.Types.ObjectId(id),
      status: status,
    });
    if (!rsvps) return res.status(404).json({ message: "no rsvps found" });
    res.status(200).json({
      rsvps,
      event: rsvps.eventId,
    });
  } catch (err) {
    console.error("RSVP fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { rsvpIds, status } = req.body;

    await RSVP.updateMany({ _id: { $in: rsvpIds } }, { $set: { status } });

    res.json({ message: `${rsvpIds.length} guests updated` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const deleteRsvp = async (req, res) => {
  try {
    const { rsvpIds } = req.body;

    const rsvp = await RSVP.findByIdAndDelete(rsvpIds);
    if (!rsvp)
      return res
        .status(404)
        .json({ success: false, message: "RSVP not found" });

    res.json({ message: `${rsvpIds.length} guests updated` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
