-- CreateTable
CREATE TABLE "misskon" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "misskon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "misskon_tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "page" TEXT NOT NULL,

    CONSTRAINT "misskon_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MisskonToMisskonTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "misskon_key_key" ON "misskon"("key");

-- CreateIndex
CREATE UNIQUE INDEX "misskon_page_key" ON "misskon"("page");

-- CreateIndex
CREATE UNIQUE INDEX "misskon_tag_name_key" ON "misskon_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "misskon_tag_page_key" ON "misskon_tag"("page");

-- CreateIndex
CREATE UNIQUE INDEX "_MisskonToMisskonTag_AB_unique" ON "_MisskonToMisskonTag"("A", "B");

-- CreateIndex
CREATE INDEX "_MisskonToMisskonTag_B_index" ON "_MisskonToMisskonTag"("B");

-- AddForeignKey
ALTER TABLE "_MisskonToMisskonTag" ADD CONSTRAINT "_MisskonToMisskonTag_A_fkey" FOREIGN KEY ("A") REFERENCES "misskon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MisskonToMisskonTag" ADD CONSTRAINT "_MisskonToMisskonTag_B_fkey" FOREIGN KEY ("B") REFERENCES "misskon_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
