const User = require("../models/User");
const AppError = require("../utils/AppError");
const { hashPassword, comparePassword } = require("../utils/password");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken,
} = require("../utils/token");

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            throw new AppError("Email already in use", 409);
        }

        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            throw new AppError("Username already taken", 409);
        }

        const passwordHash = await hashPassword(password);
        const user = await User.create(username, email, passwordHash);

        const payload = { userId: user.id, username: user.username };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashedRefresh = hashToken(refreshToken);
        await User.updateRefreshToken(user.id, hashedRefresh);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            status: "success",
            data: {
                user: { id: user.id, username: user.username, email: user.email },
                accessToken,
            },
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            throw new AppError("Invalid email or password", 401);
        }

        const payload = { userId: user.id, username: user.username };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashedRefresh = hashToken(refreshToken);
        await User.updateRefreshToken(user.id, hashedRefresh);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: "success",
            data: {
                accessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            },
        });
    } catch (err) {
        next(err);
    }
};

const refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new AppError("Refresh token required", 401);
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(token);
        } catch (err) {
            throw new AppError("Invalid or expired refresh token", 401);
        }

        const hashedToken = hashToken(token);
        const user = await User.findByRefreshToken(hashedToken);
        if (!user) {
            throw new AppError("Refresh token not recognized", 401);
        }

        const payload = { userId: user.id, username: user.username };
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        const newHashedRefresh = hashToken(newRefreshToken);
        await User.updateRefreshToken(user.id, newHashedRefresh);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: "success",
            data: { accessToken: newAccessToken },
        });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const hashedToken = hashToken(token);
            const user = await User.findByRefreshToken(hashedToken);
            if (user) {
                await User.clearRefreshToken(user.id);
            }
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, refresh, logout };
