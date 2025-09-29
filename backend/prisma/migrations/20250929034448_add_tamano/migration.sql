/*
  Warnings:

  - You are about to drop the column `photoPath` on the `Mascota` table. All the data in the column will be lost.
  - You are about to alter the column `sexo` on the `Mascota` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - Made the column `sexo` on table `Mascota` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Mascota" DROP COLUMN "photoPath",
ADD COLUMN     "fotoBucket" TEXT,
ADD COLUMN     "fotoFormat" TEXT,
ADD COLUMN     "fotoHeight" INTEGER,
ADD COLUMN     "fotoPath" TEXT,
ADD COLUMN     "fotoSizeBytes" INTEGER,
ADD COLUMN     "fotoUrl" TEXT,
ADD COLUMN     "fotoWidth" INTEGER,
ADD COLUMN     "tamano" VARCHAR(10),
ALTER COLUMN "sexo" SET NOT NULL,
ALTER COLUMN "sexo" SET DATA TYPE VARCHAR(10);
