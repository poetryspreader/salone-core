import jwt from "jsonwebtoken";

export function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "No token"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET);

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}