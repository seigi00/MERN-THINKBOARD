import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";

dotenv.config();

// Atlas uses SRV DNS lookups; some local resolvers reject these on Windows networks.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4,
        });
        console.log("MONGODB CONNECTED SUCCESSFULLY");
    }

    catch(error){
        if (error?.code === "ECONNREFUSED" && error?.syscall === "querySrv") {
            console.error(
                "SRV DNS lookup failed. If this persists, use a non-SRV Atlas URI in MONGO_URI (mongodb://...) or switch network/DNS."
            );
        }
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
}