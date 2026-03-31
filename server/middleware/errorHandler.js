/*const errorHandler = (err, req, res, next) => {
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

module.exports = errorHandler;*/

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = err.message || "Internal server error";

    console.error("FULL ERROR FOR DEBUG:", err);

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};

module.exports = errorHandler;
