const AppError = require("../utils/AppError");

const VALID_ACTIONS = ["attack", "parry", "sign", "potion"];

const validateBattleAction = (req, res, next) => {
    const { type } = req.body;

    if (!type || typeof type !== "string") {
        return next(new AppError("Action type is required", 400));
    }

    if (!VALID_ACTIONS.includes(type)) {
        return next(new AppError("Invalid action type. Must be one of: " + VALID_ACTIONS.join(", "), 400));
    }

    next();
};

module.exports = { validateBattleAction };
