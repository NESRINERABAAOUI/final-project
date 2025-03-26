const express = require("express");

const router = express.Router();
// Import midllware controllers
const {
  authMiddleware,
  authorizeRoles,
} = require("../../controllers/authControllers");

const upload = require("../../controllers/uploads");
const {
  createDocument,
  getDocumentsByUserAndStatus,
  asignTranslator,
  uploadTranslationFile,
} = require("../../controllers/documentsControllers");

router.post(
  "/create",
  authMiddleware,
  authorizeRoles("client"),
  upload.single("originalFile"),
  createDocument
);
router.get(
  "/:status",
  authMiddleware,
  authorizeRoles("client", "admin", "translator"),
  getDocumentsByUserAndStatus
);
router.put(
  "/:docId",
  authMiddleware,
  authorizeRoles("client", "admin", "translator"),
  asignTranslator
);
router.put(
  "/:docId/upload-translation",
  authMiddleware,
  authorizeRoles("translator"),
  upload.single("file"),
  uploadTranslationFile
);

module.exports = router;
