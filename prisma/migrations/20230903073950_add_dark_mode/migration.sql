-- CreateTable
CREATE TABLE "DarkMode" (
    "id" SERIAL NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DarkMode_pkey" PRIMARY KEY ("id")
);
