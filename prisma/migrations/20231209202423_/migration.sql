/*
  Warnings:

  - You are about to drop the column `selectedOptionId` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the `option` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `options` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `option` DROP FOREIGN KEY `Option_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_selectedOptionId_fkey`;

-- AlterTable
ALTER TABLE `question` ADD COLUMN `options` JSON NOT NULL;

-- AlterTable
ALTER TABLE `vote` DROP COLUMN `selectedOptionId`;

-- DropTable
DROP TABLE `option`;
