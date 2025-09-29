/*
  Warnings:

  - You are about to drop the column `fechaCumple` on the `Mascota` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Mascota" DROP COLUMN "fechaCumple",
ADD COLUMN     "cumpleDia" INTEGER,
ADD COLUMN     "cumpleMes" INTEGER;
