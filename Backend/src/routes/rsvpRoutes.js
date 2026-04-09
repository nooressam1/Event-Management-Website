import express from "express";
import {
 getRsvp
} from "../controllers/rsvpController.js";

const router = express.Router();

router.get("/:id", getRsvp);

export default router;
