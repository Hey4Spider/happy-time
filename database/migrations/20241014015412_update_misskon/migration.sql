/*
  Warnings:

  - The `like` column on the `misskon_tag` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "misskon_tag" DROP COLUMN "like",
ADD COLUMN     "like" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "misskon_tag_like_idx" ON "misskon_tag"("like");
