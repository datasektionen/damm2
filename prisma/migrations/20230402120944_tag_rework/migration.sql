/*
  Warnings:

  - You are about to drop the column `tagId` on the `Tag` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TagCategory" AS ENUM ('EVENT', 'CLUB', 'PATCHTYPE');

-- DropForeignKey
ALTER TABLE "Bag" DROP CONSTRAINT "Bag_boxId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_patchId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserCreatedPatch" DROP CONSTRAINT "UserCreatedPatch_patchId_fkey";

-- DropForeignKey
ALTER TABLE "UserCreatedPatch" DROP CONSTRAINT "UserCreatedPatch_personId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagId",
ADD COLUMN     "category" "TagCategory";

-- AddForeignKey
ALTER TABLE "Bag" ADD CONSTRAINT "Bag_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_patchId_fkey" FOREIGN KEY ("patchId") REFERENCES "Patch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCreatedPatch" ADD CONSTRAINT "UserCreatedPatch_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCreatedPatch" ADD CONSTRAINT "UserCreatedPatch_patchId_fkey" FOREIGN KEY ("patchId") REFERENCES "Patch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Tag.name_type_unique" RENAME TO "Tag_name_type_key";
