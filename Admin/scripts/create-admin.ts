import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { connectToDatabase } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import { AdminUserModel } from "../src/models/admin-user";

async function main() {
  const rl = createInterface({ input, output });
  const name = (await rl.question("Admin name: ")).trim();
  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  const password = (await rl.question("Admin password: ")).trim();
  rl.close();

  if (!name || !email || password.length < 8) {
    throw new Error("Name, email, and a password of at least 8 characters are required.");
  }

  await connectToDatabase();
  const existing = await AdminUserModel.findOne({ email });
  if (existing) {
    throw new Error("An administrator with that email already exists.");
  }

  await AdminUserModel.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "super_admin",
  });

  process.stdout.write("Admin created successfully.\n");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Unknown error"}\n`);
  process.exit(1);
});
