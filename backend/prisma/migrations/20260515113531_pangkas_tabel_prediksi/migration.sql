/*
  Warnings:

  - You are about to drop the column `ai_provider` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the column `detections` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the column `original_filename` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the column `raw_ai_response` on the `predictions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "predictions" DROP COLUMN "ai_provider",
DROP COLUMN "detections",
DROP COLUMN "file_size",
DROP COLUMN "image_url",
DROP COLUMN "mime_type",
DROP COLUMN "original_filename",
DROP COLUMN "raw_ai_response";
