
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: { type: String, required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ], 
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conversation", ConversationSchema);