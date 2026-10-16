import mongoose from "mongoose";

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI);
    return mongoose.connection;
}

export default connectDB;