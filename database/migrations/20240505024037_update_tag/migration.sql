-- AlterTable
ALTER TABLE "misskon_tag" ADD COLUMN     "like" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "misskon_key_idx" ON "misskon"("key");

-- CreateIndex
CREATE INDEX "misskon_status_idx" ON "misskon"("status");

-- CreateIndex
CREATE INDEX "misskon_tag_name_idx" ON "misskon_tag"("name");

-- CreateIndex
CREATE INDEX "misskon_tag_like_idx" ON "misskon_tag"("like");
