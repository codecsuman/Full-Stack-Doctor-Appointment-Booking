import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.atoken;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate role
        if (!decoded.role || decoded.role !== "admin") {
            return res.json({
                success: false,
                message: "Admin Access Denied",
            });
        }

        req.adminEmail = decoded.email;

        next();
    } catch (error) {
        console.error("AuthAdmin Error:", error);
        res.json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authAdmin;
