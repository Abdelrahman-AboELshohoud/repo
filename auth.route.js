const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  validateToken,
} = require("./controllers/auth.controller.js");
const { verifyToken } = require("./verifications.js");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/validate", verifyToken, validateToken);

module.exports = router;
