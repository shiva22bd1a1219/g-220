
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const saveMessage = async (req, res) => {
  const { sender, text, conversationId } = req.body;
  const {user} = req.user;
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    if (user.id !== conversation.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const newMessage = new Message({
      sender,
      text,
      conversationId,
    });

    await newMessage.save();
    conversation.messages.push(newMessage);
    await conversation.save();

    res.json({ msg: "Message saved" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}; 




module.exports = { saveMessage, getMessages };