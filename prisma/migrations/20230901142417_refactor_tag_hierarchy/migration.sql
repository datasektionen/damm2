/*
  Warnings:

  - You are about to drop the column `tagId` on the `Tag` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TagCategory" AS ENUM ('RECEPTION', 'COMMITTEE', 'EVENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_tagId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagId",
ADD COLUMN     "category" "TagCategory";
