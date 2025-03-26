const express = require("express");

const router = express.Router();
// Import midllware controllers
const {
  authMiddleware,
  authorizeRoles,
} = require("../../controllers/authControllers");

const {
  addTarif,
  updateTarif,
  deleteTarif,
  getAllTariffsByTranslator,
  getTariffsByTranslatorAndType,
} = require("../../controllers/tarifControllers");

router.get(
  "/allTariffsByTranslator/:id",
  authMiddleware,
  authorizeRoles("translator"),
  getAllTariffsByTranslator
);
router.post("/create", authMiddleware, authorizeRoles("translator"), addTarif);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("translator"),
  deleteTarif
);
router.put(
  "/update/:id",
  authMiddleware,
  authorizeRoles("translator"),
  updateTarif
);
router.get(
  "/TariffsByTranslatorAndType/:idTanslator/:idType",
  authMiddleware,
  authorizeRoles("client"),
  getTariffsByTranslatorAndType
);

module.exports = router;
