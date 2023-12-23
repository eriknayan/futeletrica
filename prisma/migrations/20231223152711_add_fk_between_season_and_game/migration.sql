-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "seasonId" BIGINT NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
