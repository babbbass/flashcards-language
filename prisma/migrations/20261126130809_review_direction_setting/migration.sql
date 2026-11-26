-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReviewLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewStateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "due" DATETIME NOT NULL,
    "stability" REAL NOT NULL,
    "difficulty" REAL NOT NULL,
    "scheduledDays" INTEGER NOT NULL,
    "learningSteps" INTEGER NOT NULL,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewLog_reviewStateId_fkey" FOREIGN KEY ("reviewStateId") REFERENCES "ReviewState" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReviewLog" ("difficulty", "due", "id", "languageCode", "learningSteps", "rating", "reviewStateId", "reviewedAt", "scheduledDays", "stability", "state", "userId") SELECT "difficulty", "due", "id", "languageCode", "learningSteps", "rating", "reviewStateId", "reviewedAt", "scheduledDays", "stability", "state", "userId" FROM "ReviewLog";
DROP TABLE "ReviewLog";
ALTER TABLE "new_ReviewLog" RENAME TO "ReviewLog";
CREATE INDEX "ReviewLog_userId_languageCode_reviewedAt_idx" ON "ReviewLog"("userId", "languageCode", "reviewedAt");
CREATE TABLE "new_ReviewState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userCardId" TEXT NOT NULL,
    "due" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stability" REAL NOT NULL DEFAULT 0,
    "difficulty" REAL NOT NULL DEFAULT 0,
    "scheduledDays" INTEGER NOT NULL DEFAULT 0,
    "learningSteps" INTEGER NOT NULL DEFAULT 0,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "state" TEXT NOT NULL DEFAULT 'NEW',
    "lastReview" DATETIME,
    CONSTRAINT "ReviewState_userCardId_fkey" FOREIGN KEY ("userCardId") REFERENCES "UserCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReviewState" ("difficulty", "due", "id", "lapses", "lastReview", "learningSteps", "reps", "scheduledDays", "stability", "state", "userCardId") SELECT "difficulty", "due", "id", "lapses", "lastReview", "learningSteps", "reps", "scheduledDays", "stability", "state", "userCardId" FROM "ReviewState";
DROP TABLE "ReviewState";
ALTER TABLE "new_ReviewState" RENAME TO "ReviewState";
CREATE UNIQUE INDEX "ReviewState_userCardId_key" ON "ReviewState"("userCardId");
CREATE INDEX "ReviewState_due_idx" ON "ReviewState"("due");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nativeLanguage" TEXT NOT NULL DEFAULT 'fr',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "lastLanguageCode" TEXT,
    "reviewDirection" TEXT NOT NULL DEFAULT 'FORWARD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "lastLanguageCode", "nativeLanguage", "timezone", "updatedAt") SELECT "createdAt", "id", "lastLanguageCode", "nativeLanguage", "timezone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

