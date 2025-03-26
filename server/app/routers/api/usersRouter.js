const express = require("express");

const router = express.Router();
// Import midllware controllers
const {
  authMiddleware,
  authorizeRoles,
} = require("../../controllers/authControllers");
// Import user controllers
const {
  getClients,
  getTranslators,
  getOneClientById,
  getOneTranslatorById,
  deleteUser,
  updateUser,
  editImage,
  getTranslatorsByLanguages,
  getAdminById,
} = require("../../controllers/usersControllers");
const upload = require("../../controllers/uploads");

// Route to get all clients
// router.get("/clients",getClients );
router.get("/clients", authMiddleware, authorizeRoles("admin"), getClients);
// Route to get all translators
// router.get("/translators",getTranslators );
router.get(
  "/translators",
  authMiddleware,
  authorizeRoles("admin"),
  getTranslators
);
// Route to get client by Id
router.get(
  "/clients/oneClient/:id",
  authMiddleware,
  authorizeRoles("admin", "client"),
  getOneClientById
);
// Route to get translator by Id
router.get(
  "/translators/oneTranslator/:id",
  authMiddleware,
  authorizeRoles("admin", "translator"),
  getOneTranslatorById
);
// Route to update a user
router.put("/:id", authMiddleware, updateUser); // Update user

// Route to delete a user
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteUser); // Delete user (only admin)
router.put("/editimage/:id", authMiddleware, upload.single("image"), editImage);
router.get("/translatorsbyLanguages", getTranslatorsByLanguages);
router.get(
  "/admins/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getAdminById
);
module.exports = router;
