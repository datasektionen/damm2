/*
  Warnings:

  - Made the column `category` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "category" SET NOT NULL;
