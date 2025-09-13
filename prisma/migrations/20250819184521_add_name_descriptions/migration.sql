-- AlterTable
ALTER TABLE "names" ADD COLUMN     "description" TEXT,
ADD COLUMN     "origin" VARCHAR(255),
ADD COLUMN     "scraped_at" TIMESTAMP(3);
