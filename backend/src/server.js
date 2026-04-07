import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start", error);
        process.exit(1);
    }
};

startServer();

// mongodb+srv://justinecelestial2002_db_user:qc1oCe45OmI5sa7O@cluster0.kwyycpi.mongodb.net/?appName=Cluster0