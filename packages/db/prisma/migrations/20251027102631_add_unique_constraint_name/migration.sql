/*
  Warnings:

  - A unique constraint covering the columns `[userId,videoId]` on the table `Upvotes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userId_videoId" ON "public"."Upvotes"("userId", "videoId");
