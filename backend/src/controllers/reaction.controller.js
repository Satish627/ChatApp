import Reaction from "../models/reaction.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const addOrUpdateReaction = async (req, res) => {
    try {
      const { messageId } = req.params;
      const { reaction } = req.body;
      const userId = req.user._id;
  
      const existingReaction = await Reaction.findOne({ messageId, userId });
  
      let reactions;
      if (existingReaction) {
        // Update existing reaction
        existingReaction.reaction = reaction;
        await existingReaction.save();
        reactions = await Reaction.find({ messageId });
        res.status(200).json({ message: "Reaction updated", reactions });
      } else {
        // Add new reaction
        const newReaction = new Reaction({
          messageId,
          userId,
          reaction
        });
        await newReaction.save();
        reactions = await Reaction.find({ messageId });
        res.status(201).json({ message: "Reaction added", reactions });
      }
  
      // Emit updated reactions to the receiver
      const message = await Message.findById(messageId);
      if (message) {
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("updateReactions", { messageId, reactions });
        }
      }
  
    } catch (error) {
      console.error("Error in addOrUpdateReaction controller:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const removeReaction = async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.user._id;
  
      const reaction = await Reaction.findOneAndDelete({ messageId, userId });
  
      if (!reaction) {
        return res.status(404).json({ error: "No reaction found for this message" });
      }
  
      // Emit a socket event to notify the receiver
      const message = await Message.findById(messageId);
      if (message) {
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("removeReaction", reaction);
        }
      }
  
      res.status(200).json({ message: "Reaction removed successfully" });
    } catch (error) {
      console.error("Error in removeReaction controller:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const getReactions = async (req, res) => {
    try {
      const { messageId } = req.params;
  
      const reactions = await Reaction.find({ messageId }).populate("userId", "fullName");
  
      if (!reactions) {
        return res.status(404).json({ error: "No reactions found for this message" });
      }
  
      res.status(200).json(reactions);
    } catch (error) {
      console.error("Error in getReactions controller:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
