/*
  Warnings:

  - You are about to drop the `DarkMode` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `category` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "category" SET NOT NULL;

-- DropTable
DROP TABLE "DarkMode";
