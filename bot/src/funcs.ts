import { ordrIdMssgFnc, prdctCfrmtn, prdctDtlMssg } from "./messages";
import { adminidS, statusIcons } from "./settings";
import { ordrcnfrmtnkybrd } from "./keyboards";
import { prisma, Order, Product, TonTransaction } from "../prisma/prismaSett";
import { InlineKeyboard } from "grammy";
import { bot } from "./botConf";

interface OrderDetails extends Order {
   TonTransaction: TonTransaction | null;
   Product: Product;
}
// after order created
export async function orderScript({
   order,
}: {
   order: Order & { Product: Product };

}) {
   try {
      if (order.payment === "TON") {
         return true;
      } else {
         const clientMessage = `${ordrIdMssgFnc(
            order.id
         )} <blockquote>${prdctDtlMssg({
            order: order,
            forWhom: "client",
         })}</blockquote> \n ${prdctCfrmtn()}`;
         await bot.api.sendMessage(order.userId, clientMessage, {
            reply_markup: ordrcnfrmtnkybrd(order.id),
            parse_mode: "HTML",
         });

         return true;
      }
   } catch (error) {
      console.error(`SMS gitmedi: ${error} Order: ${order.id}`);
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
         `${ordrIdMssgFnc(order.id)} ${prdctDtlMssg({
            order: order,
            forWhom: "admin",
         })}`,
         {
            reply_markup: new InlineKeyboard()
               .text(
                  "Kabul Et " + statusIcons.yes[3],
                  "deliverOrder_" + order.id
               ),
               /* .row()
               .text("Ýatyr " + statusIcons.no[3], "declineOrder_" + order.id)
               .row()
               .copyText(order.receiver, order.receiver), */
            parse_mode: "HTML",
         }
      );
      mssgIds.push(data.message_id);
   }

   let adminOnlineStatus = false;
   if (order.Product.chatRequired) {
      const admins = await prisma.admin.findFirst({
         where: {
            onlineSatus: true,
         },
      });
      if (admins) adminOnlineStatus = true;
   }

   const clntmssg = `${statusIcons.care[1]} ${
      order.Product.chatRequired
         ? `Sargydyňyz alyndy, bu sargydy tabşyrmak üçin käbir maglumatlar gerek, ${
              adminOnlineStatus
                 ? "admin size ýazar haýyş garaşyň"
                 : "ýöne şu waglykça adminlaryň hiçbiri online däl, online bolansoň size ýazarlar."
           }.`
         : "Sargydyňyz alyndy, mümkin bolan iň gysga wagtda size gowşurylar."
   }`;

   const clntMssg = await bot.api.sendMessage(
      order.userId,
      `${ordrIdMssgFnc(order.id)} <blockquote expandable>${prdctDtlMssg({
         order: order,
         forWhom: "client",
      })}</blockquote> \n ${clntmssg}`,
      { parse_mode: "HTML" }
   );

   await prisma.order.update({
      where: {
         id: order.id,
      },
      data: {
         mssgIds: mssgIds,
         clntMssgId: clntMssg.message_id
      },
   });
}
// function that allows sending messages to bot users
export async function sendMessages(ids: string[], message: string) {
   ids.map(async (id) => {
      bot.api.sendMessage(id, message);
   });
}
