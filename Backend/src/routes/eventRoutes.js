import express from "express";
import {
 getEvent
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/event/:id", getEvent);

export default router;
