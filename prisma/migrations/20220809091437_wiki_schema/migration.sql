/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('CONTAINS_NPC');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "uid" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uid");

-- CreateTable
CREATE TABLE "Log" (
    "lid" SERIAL NOT NULL,
    "uid" INTEGER,
    "route" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("lid")
);

-- CreateTable
CREATE TABLE "LogEntry" (
    "eid" SERIAL NOT NULL,
    "lid" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("eid")
);

-- CreateTable
CREATE TABLE "WikiPageTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WikiPageTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiPageHasTag" (
    "id" SERIAL NOT NULL,
    "wikiPageId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "WikiPageHasTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiPageCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "WikiPageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiPageRevision" (
    "id" SERIAL NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "wikiPageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WikiPageRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiPage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "WikiPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiPageRelation" (
    "id" SERIAL NOT NULL,
    "wikiPageId" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,
    "type" "RelationType" NOT NULL,

    CONSTRAINT "WikiPageRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WikiPageTag_name_key" ON "WikiPageTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WikiPageCategory_name_key" ON "WikiPageCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WikiPage_title_key" ON "WikiPage"("title");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_lid_fkey" FOREIGN KEY ("lid") REFERENCES "Log"("lid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiPageHasTag" ADD CONSTRAINT "WikiPageHasTag_wikiPageId_fkey" FOREIGN KEY ("wikiPageId") REFERENCES "WikiPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiPageHasTag" ADD CONSTRAINT "WikiPageHasTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "WikiPageTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiPageRevision" ADD CONSTRAINT "WikiPageRevision_wikiPageId_fkey" FOREIGN KEY ("wikiPageId") REFERENCES "WikiPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiPage" ADD CONSTRAINT "WikiPage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WikiPageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiPageRelation" ADD CONSTRAINT "WikiPageRelation_wikiPageId_fkey" FOREIGN KEY ("wikiPageId") REFERENCES "WikiPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiPageRelation" ADD CONSTRAINT "WikiPageRelation_relatedId_fkey" FOREIGN KEY ("relatedId") REFERENCES "WikiPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
