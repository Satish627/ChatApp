import express from "express";
import {
  addOrUpdateReaction,
  removeReaction,
  getReactions
} from "../controllers/reaction.controller.js";

const router = express.Router();

// Add or update a reaction (use PUT for update or POST for create)
router.post("/:messageId", addOrUpdateReaction);  

// Remove a reaction from a message
router.delete("/:messageId", removeReaction);

// Get all reactions for a message
router.get("/:messageId", getReactions);

export default router;
