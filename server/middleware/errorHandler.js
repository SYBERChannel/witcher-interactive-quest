const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Internal server error";

    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};

module.exports = errorHandler;