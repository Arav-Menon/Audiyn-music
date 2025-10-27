/*
  Warnings:

  - Added the required column `streamId` to the `Upvotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Upvotes" ADD COLUMN     "streamId" TEXT NOT NULL;
