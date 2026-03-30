const AppError = require("../utils/AppError");

const validateChoice = (req, res, next) => {
    const { choice_id } = req.body;

    if (!choice_id || (typeof choice_id !== "string" && typeof choice_id !== "number") || String(choice_id).trim().length === 0) {
        return next(new AppError("choice_id is required", 400));
    }

    req.body.choice_id = String(choice_id).trim();

    next();
};

const validateUseItem = (req, res, next) => {
    const { item_id } = req.body;

    if (!item_id || (typeof item_id !== "string" && typeof item_id !== "number") || String(item_id).trim().length === 0) {
        return next(new AppError("item_id is required", 400));
    }

    req.body.item_id = String(item_id).trim();

    next();
};

module.exports = { validateChoice, validateUseItem };
