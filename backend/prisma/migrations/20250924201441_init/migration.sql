-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "nombre" TEXT,
    "telefono" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mascota" (
    "id" SERIAL NOT NULL,
    "duenioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "raza" TEXT,
    "sexo" TEXT,
    "edadMeses" INTEGER,
    "pesoKg" DOUBLE PRECISION,
    "fechaCumple" TIMESTAMP(3),
    "photoPath" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nota" (
    "id" SERIAL NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagePath" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "public"."Usuario"("correo");

-- CreateIndex
CREATE INDEX "Mascota_duenioId_idx" ON "public"."Mascota"("duenioId");

-- CreateIndex
CREATE INDEX "Nota_mascotaId_idx" ON "public"."Nota"("mascotaId");

-- AddForeignKey
ALTER TABLE "public"."Mascota" ADD CONSTRAINT "Mascota_duenioId_fkey" FOREIGN KEY ("duenioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nota" ADD CONSTRAINT "Nota_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "public"."Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;
