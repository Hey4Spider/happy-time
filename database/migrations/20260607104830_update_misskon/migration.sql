/*
  Warnings:

  - You are about to drop the column `page` on the `misskon` table. All the data in the column will be lost.
  - You are about to drop the column `page` on the `misskon_tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `misskon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `misskon_tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `misskon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `misskon_tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "misskon_page_key";

-- DropIndex
DROP INDEX "misskon_tag_name_idx";

-- DropIndex
DROP INDEX "misskon_tag_page_key";

-- AlterTable
ALTER TABLE "_MisskonToMisskonTag" ADD CONSTRAINT "_MisskonToMisskonTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_MisskonToMisskonTag_AB_unique";

-- AlterTable
ALTER TABLE "misskon" DROP COLUMN "page",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "misskon_tag" DROP COLUMN "page",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "misskon_url_key" ON "misskon"("url");

-- CreateIndex
CREATE UNIQUE INDEX "misskon_tag_url_key" ON "misskon_tag"("url");
