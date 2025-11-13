import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach logged-in user ID safely
        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error("authUser:", error);
        return res.json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authUser;
