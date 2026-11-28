-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivity_userId_languageCode_day_key" ON "DailyActivity"("userId", "languageCode", "day");
