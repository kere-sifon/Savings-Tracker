import mongoose from "mongoose";

function getKidsUri(): string {
  const uri = process.env.MONGODB_KIDS_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_KIDS_URI in .env.local");
  }
  return uri;
}

const globalForMongoose = globalThis as unknown as {
  kidsMongooseConn: mongoose.Connection | undefined;
};

export function getKidsConnection(): mongoose.Connection {
  if (!globalForMongoose.kidsMongooseConn) {
    globalForMongoose.kidsMongooseConn = mongoose.createConnection(getKidsUri());
  }
  return globalForMongoose.kidsMongooseConn;
}

export async function connectKidsDB(): Promise<mongoose.Connection> {
  const conn = getKidsConnection();
  if (conn.readyState === 1) return conn;
  await conn.asPromise();
  return conn;
}
