/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `Streams` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Streams" ADD COLUMN     "roomId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Streams_videoId_key" ON "public"."Streams"("videoId");

-- AddForeignKey
ALTER TABLE "public"."Streams" ADD CONSTRAINT "Streams_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
