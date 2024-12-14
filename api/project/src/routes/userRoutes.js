const express = require("express");
const router = express.Router();
const {
  register,
  login,
  registerValidation,
  loginValidation,
  getMovieApiKey,
} = require("../controllers/userController");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/movie-api-key", getMovieApiKey);

module.exports = router;
