const AppError = require("../utils/AppError");

const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || typeof username !== "string" || username.trim().length < 3 || username.trim().length > 50) {
        return next(new AppError("Username must be between 3 and 50 characters", 400));
    }

    if (!email || typeof email !== "string") {
        return next(new AppError("Valid email is required", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new AppError("Invalid email format", 400));
    }

    if (!password || typeof password !== "string" || password.length < 6 || password.length > 128) {
        return next(new AppError("Password must be between 6 and 128 characters", 400));
    }

    req.body.username = username.trim();
    req.body.email = email.trim().toLowerCase();

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
        return next(new AppError("Email is required", 400));
    }

    if (!password || typeof password !== "string") {
        return next(new AppError("Password is required", 400));
    }

    req.body.email = email.trim().toLowerCase();

    next();
};

module.exports = { validateRegister, validateLogin };
