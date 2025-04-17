import { PaymentMethod, prisma } from "../../../../prisma/prismaSett";
import { cmcApi } from "@/lib/fetchs";
import { toncoinId } from "@/lib/settings";
import { rndmNmrGnrtr } from "@/utils/functions";
import { orderScript } from "bot/src/funcs";

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const productId = searchParams.get("pid");
   const userId = searchParams.get("bid");
   const busername = searchParams.get("bsrnm");
   const receiver = searchParams.get("rsrnm");
   const currency = (searchParams.get("crrnc") ?? "undefined") as
      | PaymentMethod
      | "undefined";

   if (
      productId === "undefined" ||
      userId === "undefined" ||
      busername === "undefined" ||
      receiver === "undefined" ||
      currency === "undefined" ||
      !productId ||
      !userId ||
      !busername ||
      !receiver ||
      !currency
   ) {
      console.error("Wrong request");
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
            message: "Product not found",
         },
         { status: 400 }
      );
   }
   // user checker and creator to do user gives message permision before this func run
   const userData = await prisma.user
      .findUnique({
         where: { id: userId },
      })
      .then(async (resuserData) => {
         /* creating user if it is not exist */
         if (resuserData) {
            return resuserData;
         } else {
            const randomNum = rndmNmrGnrtr(4);
            const generateNum =
               randomNum.toString() + userId.toString().slice(-4);
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

   // user sum checker
   const userSum =
      currency === "TMT"
         ? userData.sumTmt
         : currency === "USDT"
         ? userData.sumUsdt
         : 1;
   const productSum =
      currency === "TMT"
         ? productData.priceTMT
         : currency === "USDT"
         ? productData.priceUSDT
         : 0;
   if (userSum < productSum) {
      console.error("insufficient funds");
      return Response.json({
         success: false,
         funds: true,
         message: "Balansyňyz ýetenok!",
      });
   }

   // user sum updater
   const data =
      currency === "TMT"
         ? { sumTmt: Number((userSum - productSum).toFixed(2)) }
         : currency === "USDT"
         ? { sumUsdt: Number((userSum - productSum).toFixed(2)) }
         : {};
   const sumUpdate = await prisma.user.update({
      where: {
         id: userData.id,
      },
      data,
   });
   if (!sumUpdate) {
      console.error("User db update error");
      return Response.json({
         success: false,
         message: "User db update error",
      });
   }

   // ton priçe çheçker
   const tonPrice = currency === "TON" ? await cmcApi(toncoinId) : 1;
   if (!tonPrice) {
      console.error("CMC api error");
      return Response.json({
         success: false,
         message: "CMC api error",
      });
   }
   // order and transaction creator
   const transaction = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
         data: {
            userId: userData.id,
            productId: productData.id,
            status: "pending",
            payment: currency,
            receiver: receiver,
         },
      });
      const tonCommentData = async () => {
         if (newOrder.payment !== "TON") {
            return null;
         }

         const transactionData = await prisma.tonTransaction.create({
            data: {
               price: Number(
                  (productData.priceUSDT / Number(tonPrice)).toFixed(4)
               ),
               orderId: newOrder.id,
            },
         });
         return transactionData;
      };

      return { orderData: newOrder, tonTransaction: await tonCommentData() };
   });
   if (!transaction.orderData) {
      console.error("order db error");
      return Response.json({
         success: false,
         message: "order db error",
      });
   }

   // sending messages from bot
   const botRes = await orderScript(
      Number(userData.id),
      transaction.orderData.payment,
      productData.name,
      productData.amount,
      transaction.orderData.receiver,
      currency === "TMT" ? productData.priceTMT : productData.priceUSDT,
      transaction.orderData.id
   );
   if (!botRes) {
      console.error("Bot message failed");
      return Response.json({
         success: false,
         message: "Bot message failed",
      });
   }

   if (transaction.orderData.payment === "TON") {
      if (transaction.tonTransaction) {
         return Response.json({
            orderId: transaction.orderData.id,
            success: true,
            tonComment: `${productData.amount} ${
               productData.name === "star" ? " stars" : "Month Tg Premium"
            } for ${transaction.tonTransaction.price} TON\n\n${
               transaction.tonTransaction.id
            }`,
            price: transaction.tonTransaction.price,
         });
      }
      console.error("Transaction db error");
      return Response.json({
         success: false,
         message: "Transaction db error",
      });
   }
   return Response.json({
      success: true,
   });
}
