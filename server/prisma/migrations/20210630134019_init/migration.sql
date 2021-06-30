-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('PATCH', 'ARTEFACT');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SM_DM', 'GENERAL', 'ANNIVERSARY');

-- CreateTable
CREATE TABLE "Patch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creators" TEXT[],
    "images" TEXT[],
    "files" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "TagType" NOT NULL,
    "tagId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" "EventType" NOT NULL DEFAULT E'SM_DM',
    "protocol" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artefact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "files" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PatchToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArtefactToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag.name_type_unique" ON "Tag"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "_PatchToTag_AB_unique" ON "_PatchToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PatchToTag_B_index" ON "_PatchToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtefactToTag_AB_unique" ON "_ArtefactToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtefactToTag_B_index" ON "_ArtefactToTag"("B");

-- AddForeignKey
ALTER TABLE "Tag" ADD FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatchToTag" ADD FOREIGN KEY ("A") REFERENCES "Patch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatchToTag" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtefactToTag" ADD FOREIGN KEY ("A") REFERENCES "Artefact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtefactToTag" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
