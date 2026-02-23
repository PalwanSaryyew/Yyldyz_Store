import { ordrIdMssgFnc, prdctCfrmtn, prdctDtlMssg } from "./messages";
import { adminidS, statusIcons } from "./settings";
import { ordrcnfrmtnkybrd } from "./keyboards";
import {
   prisma,
   Order,
   Product,
   TonTransaction,
   StarTransaction,
} from "../prisma/prismaSett";
import { InlineKeyboard } from "grammy";
import { bot } from "./botConf";

interface OrderDetails extends Order {
   TonTransaction: TonTransaction | null;
   Product: Product;
}

// Yardımcı Fonksiyon: Kullanıcının Top 100'deki sırasını bulur
export async function getUserRank(userId: string) {
   const topSpenders = await getTopSpenders(100); // Önceki yazdığımız fonksiyon
   const index = topSpenders.findIndex((u) => u.userId === userId);
   return index === -1 ? null : index + 1; // 1-100 arası rank döner
}

export async function getUniqueBuyersCount() {
   const result = await prisma.order.groupBy({
      by: ["userId"],
      where: {
         status: "completed", // Sadece başarılı siparişleri baz alıyoruz
      },
   });

   return result.length; // Gruplanmış kullanıcıların sayısı
}

/* export async function getTopSpenders(limit: number) {
   const stats = await prisma.order.groupBy({
      by: ["userId", "payment"],
      where: {
         status: "completed",
         total: { gt: 0 },
      },
      _sum: {
         total: true,
      },
   });

   const userTotals: Record<string, number> = {};

   stats.forEach((stat) => {
      const userId = stat.userId;
      const amount = stat._sum.total || 0;
      const amountInTmt = stat.payment === "USDT" ? amount * 20 : amount;

      if (!userTotals[userId]) userTotals[userId] = 0;
      userTotals[userId] += amountInTmt;
   });

   return Object.entries(userTotals)
      .map(([userId, total]) => ({ userId, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
} */
export async function getTopSpenders(limit: number) {
   const excludedUserIds = [
      "5959371462",
      "5065229463",
      "1743801082",
      "6860526719",
      "6443467910",
      "7823959868",
   ];

   const stats = await prisma.order.groupBy({
      by: ["userId", "payment"],
      where: {
         status: "completed",
         total: { gt: 0 },
         userId: {
            notIn: excludedUserIds,
         },
         id: {
            lte: 5239,
         },
      },
      _sum: {
         total: true,
      },
   });

   const userTotals: Record<string, number> = {};

   stats.forEach((stat) => {
      const userId = stat.userId;
      const amount = stat._sum.total || 0;
      const amountInTmt = stat.payment === "USDT" ? amount * 20 : amount;

      if (!userTotals[userId]) userTotals[userId] = 0;
      userTotals[userId] += amountInTmt;
   });

   const userIds = Object.keys(userTotals);
   const users = await prisma.user.findMany({
      where: {
         id: { in: userIds },
      },
      select: {
         id: true,
         walNum: true,
      },
   });

   const walNumMap = new Map(users.map((u) => [u.id, u.walNum]));

   return Object.entries(userTotals)
      .map(([userId, total]) => ({
         userId,
         total,
         walNum: walNumMap.get(userId) || "",
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
}

// after order created
export async function orderScript({
   order,
}: {
   order: OrderDetails ;
}) {
   try {
      if (order.payment === "TON") {
         return true;
      } else {
         const clientMessage = `${ordrIdMssgFnc(
            order.id,
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
            reply_markup: new InlineKeyboard().text(
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
         clntMssgId: clntMssg.message_id,
      },
   });
}
// function that allows sending messages to bot users
export async function sendMessages(ids: string[], message: string) {
   ids.map(async (id) => {
      bot.api.sendMessage(id, message);
   });
}
