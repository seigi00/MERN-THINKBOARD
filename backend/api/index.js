import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let hasConnected = false;

export default async function handler(req, res) {
  if (!hasConnected) {
    await connectDB();
    hasConnected = true;
  }

  return app(req, res);
}
