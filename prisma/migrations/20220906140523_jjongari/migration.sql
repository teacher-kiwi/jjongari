-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" TEXT[],
    "text" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jjong" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "semester" TEXT,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "achievementId" TEXT,
    "usages" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "reports" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Jjong_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jjong" ADD CONSTRAINT "Jjong_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
