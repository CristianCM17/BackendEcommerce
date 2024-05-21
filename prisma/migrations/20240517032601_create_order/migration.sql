/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Order" (
    "idOrder" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "shippingAddress" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("idOrder")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
