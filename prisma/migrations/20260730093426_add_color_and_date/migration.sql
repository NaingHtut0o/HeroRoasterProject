/*
  Warnings:

  - Added the required column `colorHex` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorHex` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attribute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "colorHex" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Attribute" ("iconUrl", "id", "name") SELECT "iconUrl", "id", "name" FROM "Attribute";
DROP TABLE "Attribute";
ALTER TABLE "new_Attribute" RENAME TO "Attribute";
CREATE UNIQUE INDEX "Attribute_name_key" ON "Attribute"("name");
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "colorHex" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Job" ("description", "iconUrl", "id", "name") SELECT "description", "iconUrl", "id", "name" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_name_key" ON "Job"("name");
CREATE TABLE "new_Rarity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Rarity" ("colorHex", "id", "name") SELECT "colorHex", "id", "name" FROM "Rarity";
DROP TABLE "Rarity";
ALTER TABLE "new_Rarity" RENAME TO "Rarity";
CREATE UNIQUE INDEX "Rarity_name_key" ON "Rarity"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
