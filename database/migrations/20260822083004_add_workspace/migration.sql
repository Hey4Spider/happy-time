-- CreateTable
CREATE TABLE "workspace" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "trash" TEXT NOT NULL,

    CONSTRAINT "workspace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_key_key" ON "workspace"("key");
