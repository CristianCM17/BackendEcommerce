-- CreateTable
CREATE TABLE "Cupon" (
    "idCupon" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descuento" INTEGER NOT NULL,

    CONSTRAINT "Cupon_pkey" PRIMARY KEY ("idCupon")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cupon_codigo_key" ON "Cupon"("codigo");
