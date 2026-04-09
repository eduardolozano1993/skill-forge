const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const seedsDir = path.join(__dirname, "seeds");

function main() {
  const seedFiles = fs
    .readdirSync(seedsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => entry.name)
    .sort((left, right) => {
      if (left === "users.js") {
        return -1;
      }

      if (right === "users.js") {
        return 1;
      }

      return left.localeCompare(right);
    });

  for (const file of seedFiles) {
    const seedPath = path.join(seedsDir, file);
    const result = spawnSync(process.execPath, [seedPath], {
      stdio: "inherit",
    });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}

main();
