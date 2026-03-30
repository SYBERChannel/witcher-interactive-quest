const { Router } = require("express");
const authGuard = require("../middleware/authGuard");
const { getBattle, sendAction } = require("../controllers/battle.controller");
const { validateBattleAction } = require("../validators/battle.validator");

const router = Router();

router.use(authGuard);

router.get("/:id", getBattle);
router.post("/:id/action", validateBattleAction, sendAction);

module.exports = router;
