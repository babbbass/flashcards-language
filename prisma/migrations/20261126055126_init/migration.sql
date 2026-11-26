-- CreateTable
CREATE TABLE "Language" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "ttsLocale" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "languageCode" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Deck_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Deck_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deckId" TEXT NOT NULL,
    "key" TEXT,
    "term" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "example" TEXT,
    "exampleTranslation" TEXT,
    "phonetic" TEXT,
    "partOfSpeech" TEXT,
    "note" TEXT,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Card_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nativeLanguage" TEXT NOT NULL DEFAULT 'fr',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "lastLanguageCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "discoveredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userCardId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "ReviewLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewStateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
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

-- CreateIndex
CREATE INDEX "Deck_ownerId_idx" ON "Deck"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Deck_languageCode_slug_key" ON "Deck"("languageCode", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Card_key_key" ON "Card"("key");

-- CreateIndex
CREATE INDEX "Card_deckId_idx" ON "Card"("deckId");

-- CreateIndex
CREATE INDEX "Card_ownerId_idx" ON "Card"("ownerId");

-- CreateIndex
CREATE INDEX "UserCard_userId_status_idx" ON "UserCard"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserCard_userId_cardId_key" ON "UserCard"("userId", "cardId");

-- CreateIndex
CREATE INDEX "ReviewState_due_idx" ON "ReviewState"("due");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewState_userCardId_direction_key" ON "ReviewState"("userCardId", "direction");

-- CreateIndex
CREATE INDEX "ReviewLog_userId_languageCode_reviewedAt_idx" ON "ReviewLog"("userId", "languageCode", "reviewedAt");
