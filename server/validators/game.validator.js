const AppError = require("../utils/AppError");

const validateChoice = (req, res, next) => {
    const { choice_id } = req.body;

    if (!choice_id || typeof choice_id !== "string" || choice_id.trim().length === 0) {
        return next(new AppError("choice_id is required and must be a non-empty string", 400));
    }

    req.body.choice_id = choice_id.trim();

    next();
};

const validateUseItem = (req, res, next) => {
    const { item_id } = req.body;

    if (!item_id || typeof item_id !== "string" || item_id.trim().length === 0) {
        return next(new AppError("item_id is required and must be a non-empty string", 400));
    }

    req.body.item_id = item_id.trim();

    next();
};

module.exports = { validateChoice, validateUseItem };
