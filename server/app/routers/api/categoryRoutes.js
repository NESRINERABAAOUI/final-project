const express = require("express");

const router = express.Router();

const {
  authMiddleware,
  authorizeRoles,
} = require("../../controllers/authControllers");
const {
  create,
  getAll,
  deleteCategory,
} = require("../../controllers/categoriesControllers");

router.post("/", authMiddleware, authorizeRoles("admin"), create);
router.get("/", getAll);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

module.exports = router;
