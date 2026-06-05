import jwt from "jsonwebtoken";

export async function login(req, res) {
    try {
        const { identifier, password } = req.body;

        if (
            identifier !== process.env.ADMIN_LOGIN ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({ token });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
}