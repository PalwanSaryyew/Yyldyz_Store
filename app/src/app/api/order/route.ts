import { PaymentMethod, prisma } from "../../../../prisma/prismaSett";

import { orderScript } from "bot/src/funcs";
import {
   generateWalnum,
   getProductPrice,
   getUserBalance,
   newUserBalanceData,
   pricingTiersFunc,
   productTitle,
   tonPriceCalculator,
} from "bot/src/settings";

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const productId = searchParams.get("pid");
   const userId = searchParams.get("bid");
   const receiver = searchParams.get("rsrnm");
   const quantity = searchParams.get("qty");
   const currency = (searchParams.get("crrnc") ?? "undefined") as
      | PaymentMethod
      | "undefined";

   // checking params
   
   if (
      productId === "undefined" ||
      userId === "undefined" ||
      receiver === "undefined" ||
      currency === "undefined" ||
      !productId ||
      !userId ||
      !receiver ||
      !currency
   ) {
      return Response.json(
         {
            success: false,
            message: "Wrong request",
         },
         { status: 400 }
      );
   }

   // product checker
   const productData = await prisma.product.findUnique({
      where: { id: Number(productId) },
   });
   
   if (!productData) {
      console.error("Product not found");
      return Response.json(
         {
            success: false,
            message: "Product not found.",
         },
         { status: 404 }
      );
   }

   // if order has custom quantity, we need to calculate the price base on the quantity
   if (productData.min && quantity) {
      // checking quantity
      if (isNaN(Number(quantity))) {
         console.error("Quantity is not a number");
         return Response.json(
            {
               success: false,
               message: "Mukdar san bolmaly!",
            },
            { status: 400 }
         );
      }
      if (Number(quantity) < productData.min) {
         console.error("Quantity is less than minimum");
         return Response.json(
            {
               success: false,
               message: `Mukdar ${productData.min}-dan az bolmaly däl!`,
            },
            { status: 400 }
         );
      }
      if (Number(quantity) > productData.max) {
         console.error("Quantity is more than maximum");
         return Response.json(
            {
               success: false,
               message: `Mukdar ${productData.max}-dan köp bolmaly däl!`,
            },
            { status: 400 }
         );
      }
      // price returner base on the quantity
      const { tmtPrice, usdtPrice, amount } = pricingTiersFunc({
         product: productData,
         quantity: Number(quantity),
      });
      productData.priceTMT = tmtPrice;
      productData.priceUSDT = usdtPrice;
      productData.amount = amount;
   }

   // user checking or creating do to user gives message permision before this function run
   const userData = await prisma.user
      .findUnique({
         where: { id: userId },
      })
      .then(async (resuserData) => {
         /* creating user if it is not exist */
         if (resuserData) {
            return resuserData;
         } else {
            // generating walnum
            const generateNum = await generateWalnum(userId);
            const newUserData = await prisma.user.create({
               data: { id: userId, walNum: generateNum },
            });
            return newUserData;
         }
      });
      

   if (!userData) {
      console.error("User db error");
      return Response.json(
         {
            success: false,
            message: "User db error",
         },
         { status: 500 }
      );
   }

   // user balance checker
   const userSum = getUserBalance(userData, currency);
   const productSum = getProductPrice(productData, currency);
   if (userSum < productSum) {
      console.error("insufficient funds");
      return Response.json(
         {
            success: false,
            funds: true,
            message: "Balansyňyz ýetenok!",
         },
         { status: 400 }
      );
   }

   // preparing data for user balance update
   const data = newUserBalanceData(userSum, productSum, currency);

   // reduce user balance
   const sumUpdate = await prisma.user.update({
      where: {
         id: userData.id,
      },
      data,
   });
   
   if (!sumUpdate) {
      console.error("User db update error");
      return Response.json(
         {
            success: false,
            message: "User db update error",
         },
         { status: 500 }
      );
   }

   // ton priçe çheçker
   const tonPrice =
      currency === "TON" ? await tonPriceCalculator(productData.priceUSDT) : 1;
   if (!tonPrice) {
      console.error("Crypto price api error");
      return Response.json(
         {
            success: false,
            message: "Crypto price error",
         },
         { status: 500 }
      );
   }

   // order and transaction creator
   const transaction = await prisma.$transaction(async (prisma) => {
      // creating an order
      const newOrder = await prisma.order.create({
         data: {
            userId: userData.id,
            productId: productData.id,
            status: "pending",
            payment: currency,
            receiver: receiver,
            quantity: productData.amount,
            total:
               currency === "TMT"
                  ? productData.priceTMT
                  : currency === "USDT"
                  ? productData.priceUSDT
                  : tonPrice,
         },
      });
      const tonCommentData = async () => {
         if (newOrder.payment !== "TON") {
            return null;
         }

         const transactionData = await prisma.tonTransaction.create({
            data: {
               price: tonPrice,
               orderId: newOrder.id,
            },
         });
         return transactionData;
      };

      return { orderData: newOrder, tonTransaction: await tonCommentData() };
   });
   
   if (!transaction.orderData) {
      console.error("order db error");
      return Response.json(
         {
            success: false,
            message:
               "Bagyşläň ýalňyşlyk döredi. Eger balansyňyzdan pul alynan bolsa admin bilen habarlaşyň.",
         },
         { status: 500 }
      );
   }

   // sending message to user from bot
   const botRes = await orderScript({
      order: {
         ...transaction.orderData,
         product: productData,
      },
   });
   
   if (!botRes) {
      console.error("Bot message failed");
      return Response.json(
         {
            success: false,
            message:
               "Bagyşläň ýalňyşlyk döredi. Eger balansyňyzdan pul alynan bolsa admin bilen habarlaşyň.",
         },
         { status: 500 }
      );
   }

   // if order payment method is TON, we return the ton transaction data
   if (transaction.orderData.payment === "TON") {
      if (transaction.tonTransaction) {
         return Response.json({
            orderId: transaction.orderData.id,
            success: true,
            tonComment: `${productData.amount} ${productTitle(
               productData.name
            )} for ${transaction.tonTransaction.price} TON\n\n${
               transaction.tonTransaction.id
            }`,
            price: transaction.tonTransaction.price,
         });
      }
      // if order payment method is TON, but transaction data is not created
      console.error("Transaction db error");
      return Response.json(
         {
            success: false,
            message: "Transaction db error",
         },
         { status: 500 }
      );
   }
   // if order payment method isn't TON, we return just success
   return Response.json(
      {
         success: true,
      },
      { status: 200 }
   );
}
