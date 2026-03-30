const { Router } = require("express");
const { register, login, refresh, logout } = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../validators/auth.validator");

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
