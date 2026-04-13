import mongoose from "mongoose";

function getSavingsUri(): string {
  const uri = process.env.MONGODB_SAVINGS_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_SAVINGS_URI or MONGODB_URI in .env.local");
  }
  return uri;
}

const globalForMongoose = globalThis as unknown as {
  savingsMongooseConn: mongoose.Connection | undefined;
};

export function getSavingsConnection(): mongoose.Connection {
  if (!globalForMongoose.savingsMongooseConn) {
    globalForMongoose.savingsMongooseConn = mongoose.createConnection(getSavingsUri());
  }
  return globalForMongoose.savingsMongooseConn;
}

export async function connectSavingsDB(): Promise<mongoose.Connection> {
  const conn = getSavingsConnection();
  if (conn.readyState === 1) return conn;
  await conn.asPromise();
  return conn;
}
