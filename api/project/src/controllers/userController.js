const { body, validationResult } = require("express-validator");
const pool = require("../config/database");
const {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateToken,
} = require("../utils/auth");

const registerValidation = [
  body("username").trim().isLength({ min: 3 }).escape(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];

const listRegisterValidation = [
  body("user_id").isInt().withMessage("User ID must be an integer"),
  body("name").notEmpty().withMessage("Name is required"),
  body("type")
    .isIn(["movie", "book"])
    .withMessage("Type must be either 'movie' or 'book'"),
];

const listRegister = async (req, res) => {
  try {
    console.log("ListRegister endpoint called.");
    console.log("Request body:", req.body);

    // Extraindo os dados da requisição
    const { user_id, name, type } = req.body;

    // Validando os campos obrigatórios
    if (!user_id || !name || !type) {
      return res.status(400).json({
        error: "Missing required fields: user_id, name, and type are required.",
      });
    }

    // Validando o tipo (deve ser 'movie' ou 'book')
    if (!["movie", "book"].includes(type)) {
      return res.status(400).json({
        error: "Type must be either 'movie' or 'book'.",
      });
    }

    console.log("Inserting new list into database...");

    // Inserindo o novo registro na tabela `user_lists`
    const [result] = await pool.execute(
      "INSERT INTO user_lists (user_id, name, type) VALUES (?, ?, ?)",
      [user_id, name, type]
    );

    console.log("Insert result:", result);

    res.status(201).json({
      message: "List registered successfully",
      listId: result.insertId,
    });
  } catch (error) {
    console.error("Error in listRegister:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
];

const register = async (req, res) => {
  try {
    console.log("Register endpoint called.");
    console.log("Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    console.log("Checking if user already exists...");
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    console.log("Existing users:", existingUsers);

    if (existingUsers.length > 0) {
      console.log("User already exists.");
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("Generating salt and hashing password...");
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);
    console.log("Salt generated:", salt);
    console.log("Password hashed successfully.");

    console.log("Inserting new user into database...");
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, salt]
    );
    console.log("Insert result:", result);

    const token = generateToken(result.insertId);
    console.log("Token generated:", token);

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    console.log("Login endpoint called.");
    console.log("Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log("Checking if user exists...");
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log("Users found:", users);

    if (users.length === 0) {
      console.log("Invalid credentials: User not found.");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    console.log("Verifying password...");
    const isValidPassword = await verifyPassword(
      password,
      user.salt,
      user.password_hash
    );
    console.log("Password verification result:", isValidPassword);

    if (!isValidPassword) {
      console.log("Invalid credentials: Password mismatch.");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Generating token...");
    const token = generateToken(user.id);
    console.log("Token generated:", token);

    res.json({
      message: "Login successful",
      token,
      id: user.id, // Enviar o ID do usuário
      username: user.username, // Enviar o username
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMovieApiKey = async (req, res) => {
  try {
    // Buscar a chave da API na tabela "tokens"
    const [result] = await pool.execute(
      "SELECT api_key FROM tokens WHERE type = ?",
      ["movie"]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "API key not found" });
    }

    const apiKey = result[0].api_key;

    // Retornar a chave da API de filmes
    res.json({ apiKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getLists = async (req, res) => {
  try {
    const { user_id, type } = req.query; // Usando req.query para parâmetros de URL

    // Validação para garantir que os parâmetros sejam fornecidos
    if (!user_id || !type) {
      return res.status(400).json({
        error: "Missing required parameters: user_id and type are required.",
      });
    }

    if (!["movie", "book"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Type must be either 'movie' or 'book'." });
    }

    // Consultando as listas do usuário com os parâmetros fornecidos
    const [result] = await pool.execute(
      "SELECT * FROM user_lists WHERE user_id = ? AND type = ?",
      [user_id, type]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "No lists found" });
    }

    res.json({ lists: result });
    console.log("Lists fetched successfully.");
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addItemToList = async (req, res) => {
  try {
    console.log("AddItemToList endpoint called.");
    console.log("Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { list_id, item_id } = req.body;

    // Verificar se a lista existe
    console.log(`Checking if list with ID ${list_id} exists...`);
    const [list] = await pool.execute("SELECT * FROM user_lists WHERE id = ?", [
      list_id,
    ]);

    if (list.length === 0) {
      console.log("List not found.");
      return res.status(404).json({ error: "List not found" });
    }

    console.log("Inserting item into list_items...");

    // Inserir o vínculo na tabela `list_items`
    const [result] = await pool.execute(
      "INSERT INTO list_items (list_id, item_id) VALUES (?, ?)",
      [list_id, item_id]
    );

    console.log("Insert result:", result);

    res.status(201).json({
      message: "Item added to list successfully",
      linkId: result.insertId,
    });
  } catch (error) {
    console.error("Error in addItemToList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addItemToListValidation = [
  body("item_id")
    .isString()
    .withMessage("Item ID must be a string and is required."),
];
const reviewValidation = [
  body("id_user").isInt().withMessage("User ID must be an integer."),
  body("id_item").isString().withMessage("Item ID must be a string."),
  body("type")
    .isIn(["movie", "book"])
    .withMessage("Type must be either 'movie' or 'book'."),
  body("review").isString().withMessage("Review must be a string."),
  body("estrelas")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer between 1 and 5."),
];

const addReview = async (req, res) => {
  try {
    console.log("AddReview endpoint called.");
    console.log("Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { id_user, id_item, type, review, stars } = req.body;

    // Validar se o usuário existe
    console.log(`Checking if user with ID ${id_user} exists...`);
    const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      id_user,
    ]);
    if (user.length === 0) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found" });
    }

    // Inserindo a avaliação na tabela `reviews`
    console.log("Inserting review into database...");
    const [result] = await pool.execute(
      "INSERT INTO reviews (id_user, id_item, type, review, stars) VALUES (?, ?, ?, ?, ?)",
      [id_user, id_item, type, review, stars]
    );

    console.log("Insert result:", result);

    res.status(201).json({
      message: "Review added successfully",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllReviews = async (req, res) => {
  try {
    console.log("GetAllReviews endpoint called.");

    // Consulta todas as avaliações
    const [reviews] = await pool.execute(
      "SELECT r.id, r.id_user, u.username, r.id_item, r.type, r.review, r.stars, r.data, r.hora FROM reviews r JOIN users u ON r.id_user = u.id WHERE r.active = 1"
    );

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found." });
    }

    res.json({ reviews });
    console.log("All reviews fetched successfully.");
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { id_user } = req.query; // Obtém o ID do usuário a partir dos parâmetros da URL

    console.log(`GetUserReviews endpoint called for user ID ${id_user}.`);

    // Validação para garantir que o ID do usuário seja fornecido
    if (!id_user) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: id_user." });
    }

    // Consulta todas as avaliações feitas por um usuário específico
    const [reviews] = await pool.execute(
      "SELECT r.id, r.id_user, u.username, r.id_item, r.type, r.review, r.estrelas, r.data, r.hora FROM reviews r JOIN users u ON r.id_user = u.id WHERE r.id_user = ?",
      [id_user]
    );

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for the specified user." });
    }

    res.json({ reviews });
    console.log(`Reviews fetched successfully for user ID ${id_user}.`);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deactivateReview = async (req, res) => {
  try {
    console.log("DeactivateReview endpoint called.");
    console.log("Request body:", req.body);

    const { review_id } = req.body;

    // Validando se o ID foi fornecido
    if (!review_id) {
      return res.status(400).json({ error: "Review ID is required." });
    }

    // Verificar se o review existe
    console.log(`Checking if review with ID ${review_id} exists...`);
    const [review] = await pool.execute("SELECT * FROM reviews WHERE id = ?", [
      review_id,
    ]);

    if (review.length === 0) {
      console.log("Review not found.");
      return res.status(404).json({ error: "Review not found." });
    }

    // Atualizar o campo active para 0
    console.log(`Updating review with ID ${review_id} to active = 0...`);
    const [result] = await pool.execute(
      "UPDATE reviews SET active = 0 WHERE id = ?",
      [review_id]
    );

    console.log("Update result:", result);

    res.status(200).json({
      message: "Review deactivated successfully.",
    });
  } catch (error) {
    console.error("Error in deactivateReview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getListItens = async (req, res) => {
  const { listId, type } = req.query; // Usando req.query para pegar os parâmetros da query string

  try {
    // Corrigindo a consulta SQL e o uso de pool.execute para realizar a consulta corretamente
    const [listItens] = await pool.execute(
      `SELECT ul.name,ul.type,li.item_id
      FROM list_items li
      INNER JOIN user_lists ul ON li.list_id = ul.id
      WHERE li.list_id = ? AND ul.type = ?;`, // Adicionando filtro para o tipo
      [listId, type] // Passando listId e type como parâmetros
    );

    // Retornando os itens encontrados
    res.status(200).json({ items: listItens });
  } catch (error) {
    console.error("Erro ao buscar itens da lista:", error);
    res.status(500).json({ error: "Erro ao buscar itens da lista." });
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  listRegisterValidation,
  addItemToListValidation,
  register,
  login,
  getMovieApiKey,
  getLists,
  listRegister,
  addItemToList,
  reviewValidation,
  addReview,
  getAllReviews,
  getUserReviews,
  deactivateReview,
  getListItens,
};
