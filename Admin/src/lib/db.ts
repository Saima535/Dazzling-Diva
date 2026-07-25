import mongoose from "mongoose";

import { env } from "@/config/env";

type GlobalMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __mongooseAdmin__: GlobalMongoose | undefined;
}

const cached = global.__mongooseAdmin__ ?? {
  conn: null,
  promise: null,
};

global.__mongooseAdmin__ = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 10,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
