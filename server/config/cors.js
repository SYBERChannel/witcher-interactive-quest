const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? process.env.CLIENT_ORIGIN
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
