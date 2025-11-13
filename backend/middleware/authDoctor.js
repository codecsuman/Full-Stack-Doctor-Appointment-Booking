import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
    try {
        const token = req.headers.dtoken;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach doctor ID
        req.docId = decoded.id;

        next();
    } catch (error) {
        console.error("authDoctor:", error);
        return res.json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authDoctor;
