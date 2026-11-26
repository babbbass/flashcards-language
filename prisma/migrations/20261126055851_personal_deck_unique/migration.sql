-- DropIndex
DROP INDEX "Deck_ownerId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Deck_ownerId_languageCode_key" ON "Deck"("ownerId", "languageCode");

