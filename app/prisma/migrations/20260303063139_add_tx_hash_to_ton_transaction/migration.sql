-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'accepted', 'paid', 'delivering', 'completed', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('USDT', 'TON', 'TMT', 'STAR');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('jtn', 'star', 'tgprem', 'uc', 'exit', 'pubg', 'trgt', 'psp', 'steam', 'royale', 'gpt', 'lis', 'gplay', 'apple', 'belet', 'alem', 'clash', 'bc', 'brawl', 'roblox', 'bmusic', 'aydym', 'wifi', 'music', 'pes', 'stand');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('client', 'admin');

-- CreateEnum
CREATE TYPE "ChestType" AS ENUM ('PREMIUM', 'NORMAL');

-- CreateTable
CREATE TABLE "Admin" (
    "tgId" TEXT NOT NULL,
    "onlineSatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedPassword" TEXT,
    "nick" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("tgId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "payment" "PaymentMethod" NOT NULL,
    "receiver" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "courierid" TEXT,
    "mssgIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productAmountId" INTEGER,
    "quantity" INTEGER DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "clntMssgId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" "ProductType" NOT NULL,
    "amount" INTEGER,
    "duration" TEXT,
    "priceBuy" DOUBLE PRECISION NOT NULL,
    "priceTMT" DOUBLE PRECISION NOT NULL,
    "priceUSDT" DOUBLE PRECISION NOT NULL,
    "picture" TEXT,
    "pictures" TEXT[],
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatRequired" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "requirementsId" INTEGER,
    "max" INTEGER NOT NULL DEFAULT 0,
    "min" INTEGER NOT NULL DEFAULT 0,
    "pricingTiers" JSONB NOT NULL DEFAULT '[]',
    "Details" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "campaignId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCampaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirements" (
    "id" SERIAL NOT NULL,
    "asking" TEXT NOT NULL,
    "expecting" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummUpdate" (
    "id" SERIAL NOT NULL,
    "sum" DOUBLE PRECISION NOT NULL,
    "currency" "PaymentMethod" NOT NULL,
    "cashierid" TEXT NOT NULL,
    "clientid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SummUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TonTransaction" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "orderId" INTEGER NOT NULL,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TonTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarTransaction" (
    "id" TEXT NOT NULL,
    "chargeId" TEXT,
    "price" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "PaymentMethod" NOT NULL,
    "senderid" TEXT NOT NULL,
    "recieverid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walNum" TEXT NOT NULL,
    "sumTmt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sumUsdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "role" "UserRole" NOT NULL DEFAULT 'client',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chest" (
    "id" INTEGER NOT NULL,
    "type" "ChestType" NOT NULL,
    "fullname" TEXT,
    "reward" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_tgId_key" ON "Admin"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nick_key" ON "Admin"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredId_key" ON "Referral"("referredId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCampaign_name_key" ON "ReferralCampaign"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TonTransaction_orderId_key" ON "TonTransaction"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "StarTransaction_chargeId_key" ON "StarTransaction"("chargeId");

-- CreateIndex
CREATE UNIQUE INDEX "StarTransaction_orderId_key" ON "StarTransaction"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_walNum_key" ON "User"("walNum");

-- CreateIndex
CREATE UNIQUE INDEX "Chest_userId_key" ON "Chest"("userId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_courierid_fkey" FOREIGN KEY ("courierid") REFERENCES "Admin"("tgId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_requirementsId_fkey" FOREIGN KEY ("requirementsId") REFERENCES "Requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "ReferralCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummUpdate" ADD CONSTRAINT "SummUpdate_cashierid_fkey" FOREIGN KEY ("cashierid") REFERENCES "Admin"("tgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummUpdate" ADD CONSTRAINT "SummUpdate_clientid_fkey" FOREIGN KEY ("clientid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TonTransaction" ADD CONSTRAINT "TonTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarTransaction" ADD CONSTRAINT "StarTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_recieverid_fkey" FOREIGN KEY ("recieverid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chest" ADD CONSTRAINT "Chest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
