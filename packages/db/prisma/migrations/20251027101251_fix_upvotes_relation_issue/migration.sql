-- DropForeignKey
ALTER TABLE "public"."Upvotes" DROP CONSTRAINT "Upvotes_videoId_fkey";

-- DropIndex
DROP INDEX "public"."Upvotes_userId_videoId_key";

-- AddForeignKey
ALTER TABLE "public"."Upvotes" ADD CONSTRAINT "Upvotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "public"."Streams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
