const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authenticateToken = require('../middleware/authenticateToken');
const {
  createUser,
  loginUser,
} = require("../controllers/LoginSignupController");
const {saveConversation, getConversations,getConversationById} = require("../controllers/ConversationController");
const {saveMessage, getMessages} = require("../controllers/MessageController")

// signup route
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  createUser
);

// login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }), 
  ],
  loginUser
);


// query route
// router.post("/messages", queryingFromRag);

router.post('/create-history', authenticateToken, saveConversation);
router.get("/history",authenticateToken,getConversations)
router.get('/history/:id', authenticateToken, getConversationById);

router.post("/add-message",authenticateToken,saveMessage)
router.get("/get-message",authenticateToken,getMessages)


module.exports = router;
