const Leaderboard = require("../models/Leaderboard");

const getLeaderboard = async (req, res, next) => {
    try {
        const entries = await Leaderboard.getTop(100);

        res.status(200).json({
            status: "success",
            data: { leaderboard: entries },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getLeaderboard };
