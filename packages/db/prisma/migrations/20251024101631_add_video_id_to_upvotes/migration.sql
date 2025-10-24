/*
  Warnings:

  - The values [Spotify,Youtube] on the enum `StreamType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `active` on the `Streams` table. All the data in the column will be lost.
  - You are about to drop the column `extractedId` on the `Streams` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Streams` table. All the data in the column will be lost.
  - You are about to drop the column `streamId` on the `Upvotes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,videoId]` on the table `Upvotes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistName` to the `Streams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songName` to the `Streams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Streams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `Streams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `Upvotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."StreamType_new" AS ENUM ('VIDEO', 'SONG', 'PLAYLIST', 'ARTIST', 'ALBUM');
ALTER TABLE "public"."Streams" ALTER COLUMN "type" TYPE "public"."StreamType_new" USING ("type"::text::"public"."StreamType_new");
ALTER TYPE "public"."StreamType" RENAME TO "StreamType_old";
ALTER TYPE "public"."StreamType_new" RENAME TO "StreamType";
DROP TYPE "public"."StreamType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Upvotes" DROP CONSTRAINT "Upvotes_streamId_fkey";

-- DropIndex
DROP INDEX "public"."Upvotes_userId_streamId_key";

-- AlterTable
ALTER TABLE "public"."Streams" DROP COLUMN "active",
DROP COLUMN "extractedId",
DROP COLUMN "url",
ADD COLUMN     "artistName" TEXT NOT NULL,
ADD COLUMN     "songName" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "videoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Upvotes" DROP COLUMN "streamId",
ADD COLUMN     "videoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Upvotes_userId_videoId_key" ON "public"."Upvotes"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "public"."Upvotes" ADD CONSTRAINT "Upvotes_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Streams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
