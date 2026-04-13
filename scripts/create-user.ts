import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectSavingsDB } from "../lib/db-savings";
import { User } from "../lib/models/savings/User";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const roleArg = process.argv[4];
  const role =
    roleArg === "admin" || roleArg === "user" ? roleArg : "user";

  if (!email || !password) {
    console.error(
      "Usage: npm run create-user -- <email> <password> [admin|user]",
    );
    process.exit(1);
  }

  await connectSavingsDB();
  const passwordHash = await bcrypt.hash(password, 12);
  const doc = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
  });
  console.log("Created user:", doc.email, "role:", doc.role);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
