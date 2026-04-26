import express from "express";
import { getPublicEvents } from "../controllers/publicController.js";

const router = express.Router();

router.get("/events", getPublicEvents);

export default router;
