import { ordrIdMssgFnc, prdctCfrmtn, prdctDtlMssg } from "./messages";
import { adminidS, bot, statusIcons } from "./settings";
import { ordrcnfrmtnkybrd } from "./keyboards";
import {
   prisma,
   Order,
   PaymentMethod,
   Product,
   ProductType,
   TonTransaction,
} from "../prisma/prismaSett";
import { InlineKeyboard } from "grammy";

interface OrderDetails extends Order {
   tonTransaction: TonTransaction | null;
   product: Product;
}
// after order created
export async function orderScript(
   buyerId: number,
   currency: PaymentMethod,
   product: ProductType,
   amount: number,
   receiver: string,
   total: number,
   orderId: number
) {
   try {
      if (currency === "TON") {
         return true;
      } else {
         const clientMessage = `${ordrIdMssgFnc(
            orderId
         )} <blockquote>${prdctDtlMssg(
            product,
            amount,
            receiver,
            total,
            currency
         )}</blockquote> \n ${prdctCfrmtn()}`;
         await bot.api.sendMessage(buyerId, clientMessage, {
            reply_markup: ordrcnfrmtnkybrd(orderId),
            parse_mode: "HTML",
         });

         return true;
      }
   } catch (error) {
      console.error(`SMS gitmedi: ${error}`);
      return false;
   }
}
// after ton order created
export async function noticeAdmins(order: OrderDetails) {
   const mssgIds: number[] = [];
   //caht id comes ?

   for (const adminid of adminidS) {
      console.log(adminid);
      const data = await bot.api.sendMessage(
         adminid,
         `${ordrIdMssgFnc(order.id)} ${prdctDtlMssg(
            order.product.name,
            order.product.amount,
            order.receiver,
            order.tonTransaction?.price ?? 0,
            order.payment,
            order.userId
         )}`,
         {
            reply_markup: new InlineKeyboard()
               .text(
                  "Kabul Et " + statusIcons.yes[3],
                  "deliverOrder_" + order.id
               )
               .row()
               .text("Ýatyr " + statusIcons.no[3], "declineOrder_" + order.id)
               .row()
               .copyText(order.receiver, order.receiver),
            parse_mode: "HTML",
         }
      );
      mssgIds.push(data.message_id);
   }
   const clntmssg = `${
      statusIcons.care[1]
   } ${"Sargydyňyz alyndy, mümkin bolan iň gysga wagtda size gowşurylar."}`;
   await bot.api.sendMessage(
      order.userId,
      `${ordrIdMssgFnc(order.id)} <blockquote expandable>${prdctDtlMssg(
         order.product.name,
         order.product.amount,
         order.receiver,
         order.tonTransaction?.price ?? 0,
         order.payment
      )}</blockquote> \n ${clntmssg}`,
      { parse_mode: "HTML" }
   );

   await prisma.order.update({
      where: {
         id: order.id,
      },
      data: {
         mssgIds: mssgIds,
      },
   });
}
// function that allows sending messages to bot users
export async function sendMessages(ids: string[], message: string) {
   ids.map(async (id) => {
      bot.api.sendMessage(id, message);
   });
}
