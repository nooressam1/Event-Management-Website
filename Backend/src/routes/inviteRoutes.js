import express from "express";
import { getEventByInviteCode, submitRsvpFromInvite } from "../controllers/inviteController.js";

const router = express.Router();

router.get("/:inviteCode", getEventByInviteCode);
router.post("/:inviteCode", submitRsvpFromInvite);

export default router;
