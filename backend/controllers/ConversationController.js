
const Conversation = require("../models/Conversation");

const saveConversation = async (req, res) => {
  const { name, messages } = req.body;
 
  const { user } = req.user; // Assuming you have user information in req.user
  const userId = user.id
  try {
    const newConversation = new Conversation({
      userId,
      name,
      messages,
    });

    await newConversation.save();
    res.json(newConversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getConversations = async (req, res) => {
  const { user } = req.user; // Assuming you have user information in req.user
  const userId = user.id
  try {
    const conversations = await Conversation.find({ userId });
    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


const getConversationById = async (req, res) => {
  try {
    const {user} = req.user
    const conversation = await Conversation.findById(req.params.id);
    console.log(conversation)
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    if (user.id !== conversation.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    } 
    res.send(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveConversation, getConversations,getConversationById };