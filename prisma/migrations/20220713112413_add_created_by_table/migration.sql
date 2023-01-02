-- CreateTable
CREATE TABLE "UserCreatedPatch" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "patchId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCreatedPatch" ADD FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCreatedPatch" ADD FOREIGN KEY ("patchId") REFERENCES "Patch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
