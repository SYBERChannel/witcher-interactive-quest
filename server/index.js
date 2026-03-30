require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/cors");
const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const gameRoutes = require("./routes/game.routes");
const battleRoutes = require("./routes/battle.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");

const app = express();

app.set('etag', false)
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/battle", battleRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
