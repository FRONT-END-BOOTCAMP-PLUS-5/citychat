import bcrypt from "bcryptjs";

(async () => {
  const plainPassword = "asdf";
  const hashedList: string[] = [];

  for (let i = 0; i < 40; i++) {
    const hashed = await bcrypt.hash(plainPassword, 10);
    hashedList.push(hashed);
  }

  console.log("🔐 Hashed Passwords:");
  hashedList.forEach((h, idx) => {
    console.log(`${idx + 1}: ${h}`);
  });
})();

