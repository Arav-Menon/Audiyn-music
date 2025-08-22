/*
  Warnings:

  - The `isPrivate` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Room" DROP COLUMN "isPrivate",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
