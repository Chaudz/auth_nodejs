import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.URL_MONGODB}`);
    console.log("connect is successfully");

    await mongoose.connection.db
      .collection("users")
      .createIndex({ userName: 1 }, { unique: true });
    console.log("Index for userName created");
  } catch (error) {
    console.log("connect is fail");
  }
};

export default connectDB;
