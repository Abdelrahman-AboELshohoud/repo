const User = require("../User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let user;

    if (role === "patient") {
      user = await User.create({
        name,
        email,
        password,
        role,
        qualifications,
      });
    }
    if (role === "nurse") {
      if (!qualifications) {
        return res
          .status(400)
          .json({ message: "Qualifications are required for nurses" });
      }
      user = await User.create({
        name,
        email,
        password,
        role,
        qualifications,
      });
    }
    await user.save();

    sendToken(user, 201, res);
  } catch (error) {
    console.log(error, "error in register server");
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatching = await bcrypt.compare(password, user.password);
    if (!isMatching) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error, "error in login server");
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  res
    .cookie("auth_token", "", { maxAge: 0 })
    .status(200)
    .json({ message: "Logged out" });
};

const validateToken = async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ userId: decoded.userId });
};

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res
    .status(statusCode)
    .cookie("auth_token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    })
    .json({ userId: user.id });
};

module.exports = { register, login, logout, validateToken };
