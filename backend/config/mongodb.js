import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () =>
            console.log("✅ MongoDB Connected")
        );

        await mongoose.connect(process.env.MONGODB_URI);

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
