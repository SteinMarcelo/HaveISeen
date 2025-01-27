const express = require("express");
const router = express.Router();
const {
  register,
  login,
  registerValidation,
  loginValidation,
  getMovieApiKey,
  listRegisterValidation,
  listRegister,
  getLists,
  addItemToList,
  addItemToListValidation,
  addReview,
  getAllReviews,
  getUserReviews,
  deactivateReview,
  getListItens,
} = require("../controllers/userController");

// Rota para registro de usuário
router.post("/register", registerValidation, register);

// Rota para adicionar item a uma lista
router.post("/addItemToList", addItemToListValidation, addItemToList);

// Rota para login de usuário
router.post("/login", loginValidation, login);

// Rota para obter chave da API de filmes
router.get("/movie-api-key", getMovieApiKey);

// Rota para registrar uma nova lista
router.post("/listRegister", listRegisterValidation, listRegister);

// Rota para obter todas as listas do usuário
router.get("/lists", getLists);
router.post("/postReview", addReview)

// Rota para obter todas as avaliações
router.get("/reviews", getAllReviews);

// Rota para obter avaliações de um usuário específico
router.get("/reviews/user", getUserReviews);
// Rota para excluir review
router.put("/deactivateReview", deactivateReview)

router.get("/listItens", getListItens);

module.exports = router;
