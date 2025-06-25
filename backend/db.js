import mongoose from "mongoose";

//mongoose.set("strictQuery", false); 

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};
export {conn};
