/*
  Warnings:

  - You are about to drop the column `votes` on the `poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `poll` DROP COLUMN `votes`;

-- AlterTable
ALTER TABLE `question` ADD COLUMN `votes` INTEGER NOT NULL DEFAULT 0;
