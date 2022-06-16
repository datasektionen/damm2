-- AlterTable
ALTER TABLE "Patch" ADD COLUMN     "bagId" INTEGER;

-- CreateTable
CREATE TABLE "Box" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "boxId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Patch" ADD FOREIGN KEY ("bagId") REFERENCES "Bag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bag" ADD FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE CASCADE ON UPDATE CASCADE;
