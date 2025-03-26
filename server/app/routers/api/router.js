const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Import And Use Routers Here
/* ************************************************************************* */

const authRouter = require("./authRouter");
const languageRouter = require("./languageRouter");
const usersRouter = require("./usersRouter");
const categoryRouter = require("./categoryRoutes");
const tariffsRouter = require("./tarifsRoutes");
const documentsRouter = require("./documentRoutes");

router.use("/auth", authRouter);
router.use("/languages", languageRouter);
router.use("/users", usersRouter);
router.use("/categories", categoryRouter);
router.use("/tariffs", tariffsRouter);
router.use("/documents", documentsRouter);

/* ************************************************************************* */

module.exports = router;
