const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/token");

const authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Access token required", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = { userId: decoded.userId, username: decoded.username };
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new AppError("Access token expired", 401));
        }
        return next(new AppError("Invalid access token", 401));
    }
};

module.exports = authGuard;
