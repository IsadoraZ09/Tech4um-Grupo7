const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  forumId: { type: mongoose.Schema.Types.ObjectId, ref: "Forum", required: true },
  sender: { type: String, required: true },
  to: { type: String, default: null },
  text: { type: String, required: true },
  private: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
