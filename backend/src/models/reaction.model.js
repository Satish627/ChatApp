// models/reaction.model.js
import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reaction: {
      type: String,
      enum: ["like", "love", "sad", "angry", "haha", "wow"], // Define possible reactions
      required: true
    }
  },
  { timestamps: true }
);

const Reaction = mongoose.model("Reaction", ReactionSchema);
export default Reaction;
