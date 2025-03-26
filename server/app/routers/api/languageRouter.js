const express = require("express");

const router = express.Router();

const {
  authMiddleware,
  authorizeRoles,
} = require("../../controllers/authControllers");
const {
  create,
  getAll,
  deleteLanguage,
} = require("../../controllers/languagesControllers");

router.post("/", authMiddleware, authorizeRoles("admin"), create);
router.get("/", getAll);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteLanguage);

module.exports = router;
