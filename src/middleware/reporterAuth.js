const jwt = require("jsonwebtoken");
const User = require("../models/user");

const reporterAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = await jwt.verify(token, "Geonews@123");
        const { _id } = decoded;
        const reporter = await User.findById(_id);

        if (!reporter) {
            return res.status(401).json({ error: "Invalid token: user not found" });
        }

        if (reporter.role !== "reporter") {
            return res.status(403).json({ error: "Access denied. Only reporters allowed." });
        }

        req.reporter = reporter;
        next();
    } catch (error) {
        res.status(500).json({ error: "Something went wrong with reporterAuth" });
    }
};


module.exports = reporterAuth;
