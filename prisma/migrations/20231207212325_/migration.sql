/*
  Warnings:

  - Added the required column `votes` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `poll` ADD COLUMN `votes` INTEGER NOT NULL;
