import mongoose from "mongoose";

let connection = null;

export const connectToDatabase = async () => {
  if (connection) {
    console.log("Already connected to the database");
    return connection;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "AcePrep",
    });
    connection = db;
    console.log("connected to the database");
    return db;
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw new Error("Failed to connect to the database");
  }
};
