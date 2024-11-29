const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "7FgR$#0D9n!23vTq";

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      email: email,
      password: hashedPassword,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to create User", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({ errors: "Incorrect email address" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ errors: "Incorrect password" });
    }

    const data = {
      user: {
        id: userData.id,
      },
    };

    const authToken = jwt.sign(data, jwtSecret);

    res.json({ success: true, authToken: authToken });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { createUser, loginUser };
