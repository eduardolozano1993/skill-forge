-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_organizations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "organizations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_organizations" ("created_at", "employee_id", "id", "name", "updated_at") SELECT "created_at", "employee_id", "id", "name", "updated_at" FROM "organizations";
DROP TABLE "organizations";
ALTER TABLE "new_organizations" RENAME TO "organizations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
