const { Router } = require("express");
const authGuard = require("../middleware/authGuard");
const { newGame, getState, getScene, makeChoice, getInventory, useItem } = require("../controllers/game.controller");
const { validateChoice, validateUseItem } = require("../validators/game.validator");

const router = Router();

router.use(authGuard);

router.post("/new", newGame);
router.get("/state", getState);
router.get("/scene", getScene);
router.post("/choice", validateChoice, makeChoice);
router.get("/inventory", getInventory);
router.post("/use-item", validateUseItem, useItem);

module.exports = router;
