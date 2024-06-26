import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.URL_MONGODB}`);
    console.log("connect is successfully");
  } catch (error) {
    console.log("connect is fail");
  }
};

export default connectDB;
