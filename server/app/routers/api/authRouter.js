const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import authentication controllers
const { login, signup } = require("../../controllers/authControllers");

// Route to get a specific item by ID
router.post("/login", login);

// Route to add a new item
router.post("/signup", signup);

/* ************************************************************************* */

module.exports = router;
