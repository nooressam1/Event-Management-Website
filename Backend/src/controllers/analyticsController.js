import { computeEventAnalytics } from "../services/Analytics_Service/analyticsService.js";

// GET /api/analytics/events/:id
export const getEventAnalytics = async (req, res) => {
  try {
    const analytics = await computeEventAnalytics(req.params.id, req.user.id);
    if (!analytics)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
