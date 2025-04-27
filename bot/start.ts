import { InlineKeyboard } from "grammy";
import { prisma } from "./prisma/prismaSett";
import {
   adminidS,
   bot,
   editSummComand,
   ordrMsgEdtStts,
   reasonStates,
   statusIcons,
   sumAddStates,
} from "./src/settings";
import { PaymentMethod } from "./prisma/prismaSett";
import { err_6, err_7 } from "./src/errCodes";
import {
   adminValid,
   chatIdV,
   isAdminId,
   userValid,
   validator,
} from "./src/validators";
import {
   hspMsg,
   ordrCmltdMssgFnc,
   ordrDclngMssgFnc,
   ordrDlvrng,
   ordrIdMssgFnc,
   prdctDtlMssg,
   sspcsCaseMs,
   userLink,
} from "./src/messages";
import { cnclAddSumBtnn, dlvrOrdrKybrd } from "./src/keyboards";

export const tikTokStates = new Map<
   string,
   {
      adminId: number;
      mssgId: number;
      orderId: number;
      code: string;
      pass: string;
   }
>();
export const chatStates = new Map<
   number,
   {
      userId: number;
      messageIds: number[];
   }
>();
//admin
bot.command("admin", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID || chatStates.get(userID) || isAdminId(userID).error === false) {
      return ctx.deleteMessage();
   }
   const messageIds: number[] = [];
   for (const adminId of adminidS) {
      const { message_id } = await ctx.api.sendMessage(
         adminId,
         `${userLink(userID, ctx.from?.first_name)} söhbetdeşlik talap edýär`,
         {
            reply_markup: new InlineKeyboard().text(
               "Tassykla",
               "acceptChat_" + userID
            ),
            parse_mode: "HTML",
         }
      );
      messageIds.push(message_id);
   }
   chatStates.set(userID, { userId: 0, messageIds: messageIds });
   ctx.reply("Admin söhbetdeşligi kabul etýänçä garaşyň. Size habar beriler.");
});
bot.callbackQuery(/acceptChat_(.+)/, async (ctx) => {
   const adminID = ctx.from.id;
   const userID = parseInt(ctx.match[1]);
   const chatState = chatStates.get(userID);

   if (!chatState || !userID || !adminID) {
      return;
   }
   if (chatStates.get(adminID)) {
      return ctx.answerCallbackQuery(
         "Siz öňem sohbetdeşlikde, ilki öňki söhbetdeşligi tamamlaň!"
      );
   }

   await ctx.api.sendMessage(userID, "Admin söhbetdeşligi kabul etdi.");
   for (let i = 0; i < adminidS.length; i++) {
      ctx.api.editMessageText(
         adminidS[i],
         chatState?.messageIds[i],
         `${userLink(adminID, ctx.from.first_name)} bilen ${userLink(
            userID
         )} söhbetdeşlik edýär.`,
         { parse_mode: "HTML" }
      );
   }
   chatState.userId = adminID;
   chatStates.set(adminID, {
      userId: userID,
      messageIds: chatState.messageIds,
   });
});
bot.command("stop", async (ctx) => {
   const userID = ctx.from?.id || 0;
   const chatState = chatStates.get(userID);
   if (!userID || !chatState) {
      return ctx.deleteMessage();
   }

   await ctx.reply(`Söhbetdeşlik tamamlandy.`);
   await ctx.api.sendMessage(
      chatState.userId,
      `<blockquote>bot</blockquote> Söhbetdeşlik tamamlandy.`,
      { parse_mode: "HTML" }
   );
   if (chatState.messageIds.length > 0) {
      for (let i = 0; i < adminidS.length; i++) {
         ctx.api.editMessageText(
            adminidS[i],
            chatState?.messageIds[i],
            `${userLink(userID, ctx.from?.first_name)} ${userLink(
               chatState.userId
            )} bilen söhbetdeşligi tamamlady.`,
            { parse_mode: "HTML" }
         );
      }
   }

   chatStates.delete(userID);
   chatStates.delete(chatState.userId);
});

bot.command("on", async (ctx) => {
   const userID = ctx.from?.id;

   if (!userID) {
      return ctx.deleteMessage();
   }
   const isAmdin = isAdminId(userID);
   if (isAmdin.error) {
      return ctx.deleteMessage();
   }
   const status = await prisma.admin.update({
      where: {
         tgId: userID.toString(),
      },
      data: {
         onlineSatus: true,
      },
   });
   if (status) {
      return ctx.reply("Siz Online " + statusIcons.yes[3]);
   } else {
      return ctx.deleteMessage();
   }
});
bot.command("of", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return ctx.deleteMessage();
   }
   const isAmdin = isAdminId(userID);
   if (isAmdin.error) {
      return ctx.deleteMessage();
   }
   const status = await prisma.admin.update({
      where: {
         tgId: userID.toString(),
      },
      data: {
         onlineSatus: false,
      },
   });
   if (status) {
      return ctx.reply("Siz Offline " + statusIcons.no[3]);
   } else {
      return ctx.deleteMessage();
   }
});

/* start command */
bot.command("test", async (ctx) => {
   ctx.reply(`${statusIcons.yes} \n ${statusIcons.no} \n ${statusIcons.care}`, {
      parse_mode: "HTML",
   });
});
bot.command("start", async (ctx) => {
   const userID = ctx.from?.id;
   // çreating user to do geting message permission
   const user = await userValid(userID, true);
   if ("error" in user) {
      return ctx.reply(user.mssg + " \n Täzeden synanşyň /start");
   }

   ctx.reply("Söwda başlamak üçin aşakdaky düwmä basyň", {
      reply_markup: new InlineKeyboard()
         .webApp("Başla 🛒", "https://yyldyz.store")
         .row()
         .url("Kanalymyz 📢", "https://t.me/YyldyzKanal")
         .row()
         .url("Grupbamyz 💬", "https://t.me/YyldyzChat"),
   });
});
// hasap command
bot.command("hasap", async (ctx) => {
   const userID = ctx.from?.id;
   // geting user
   const user = await userValid(userID);
   if ("error" in user) {
      return ctx.reply(
         user.mssg +
            " \n Täzeden synanşyň /hasap \n ýada /start berip boty başladyň"
      );
   }
   ctx.reply(hspMsg(user.walNum, user.sumTmt, user.sumUsdt), {
      reply_markup: new InlineKeyboard().copyText(user.walNum, user.walNum),
      parse_mode: "HTML",
   });
});
// if order aççept by the çlient
bot.callbackQuery(/acceptOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const clntID = ctx.from.id;

   //caht id comes ?
   const chatId = chatIdV(clntID);
   if (chatId.error) {
      return await ctx.answerCallbackQuery({
         text: chatId.mssg,
         show_alert: true,
      });
   }
   // validates and turnes order details
   const order = await validator(orderId, ["pending"], "accepted");
   if ("error" in order) {
      return await ctx.answerCallbackQuery({
         text: order.mssg,
         show_alert: true,
      });
   }
   // order belongs to ovner of wallet ?
   if (order.userId !== clntID.toString()) {
      return await ctx.answerCallbackQuery({
         text: "Sargydyň eyesi siz däl",
         show_alert: true,
      });
   }
   // preparing messages
   const ordIdMssg = ordrIdMssgFnc(order.id);
   try {
      // sending messages to admins and collecting messages ids orderly
      const mssgIds: number[] = [];
      for (const adminid of adminidS) {
         const data = await bot.api.sendMessage(
            adminid,
            `${ordIdMssg} ${prdctDtlMssg(
               order.product.name,
               order.product.amount || 0,
               order.receiver,
               order.payment === "TMT"
                  ? order.product.priceTMT
                  : order.product.priceUSDT,
               order.payment,
               ctx.from.id,
               ctx.from.first_name
            )}`,
            {
               reply_markup: dlvrOrdrKybrd(order),
               parse_mode: "HTML",
            }
         );
         mssgIds.push(data.message_id);
      }
      ordrMsgEdtStts.set(orderId, { mssgIds: mssgIds });

      let adminOnlineStatus = false;
      if (order.product.chatRequired) {
         chatStates.set(Number(order.userId), { userId: 0, messageIds: [] });
         const admins = await prisma.admin.findFirst({
            where: {
               onlineSatus: true,
            },
         });
         if (admins) adminOnlineStatus = true;
      }

      const clntmssg = `${statusIcons.care[1]} ${
         order.product.chatRequired
            ? `Sargydyňyz alyndy, bu sargydy tabşyrmak üçin käbir maglumatlar gerek, ${
                 adminOnlineStatus
                    ? "admin size ýazar haýyş garaşyň"
                    : "ýöne şu waglykça adminlaryň hiçbiri online däl. Sargydyňyzy ýatyryp ýa-da adminleň biri size ýazýança garaşyp bilersiňiz"
              }.`
            : "Sargydyňyz alyndy, mümkin bolan iň gysga wagtda size gowşurylar."
      }`;

      await ctx.editMessageText(
         `${ordIdMssg} <blockquote expandable>${prdctDtlMssg(
            order.product.name,
            order.product.amount || 0,
            order.receiver,
            order.payment === "TMT"
               ? order.product.priceTMT
               : order.product.priceUSDT,
            order.payment
         )}</blockquote> \n ${clntmssg}`,
         {
            parse_mode: "HTML",
            reply_markup:
               adminOnlineStatus && order.product.chatRequired
                  ? undefined
                  : new InlineKeyboard().text(
                       "Ýatyr " + statusIcons.no[2],
                       "cancelOrder_" + order.id
                    ),
         }
      );
   } catch (error) {
      console.error("SMS ERROR::", error);
      await ctx.answerCallbackQuery({
         text: "Sargyt kabul edilyarka yalnyslyk doredi.",
         show_alert: true,
      });
   }
});
// if order çançelled by client
bot.callbackQuery(/cancelOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const clntID = ctx.from.id;
   const chatState = chatStates.get(clntID);
   //caht id comes ?
   const chatId = chatIdV(clntID);
   if (chatId.error) {
      return await ctx.answerCallbackQuery({
         text: chatId.mssg,
         show_alert: true,
      });
   }

   // validates and turnes order details
   const order = await validator(
      orderId,
      ["pending", chatState ? "accepted" : "pending"],
      "cancelled"
   );
   if ("error" in order) {
      return await ctx.answerCallbackQuery({
         text: order.mssg,
         show_alert: true,
      });
   }

   if (chatState) {
      chatStates.delete(clntID);
   }

   // order belongs to ovner of wallet ?
   if (order.userId !== clntID.toString()) {
      return await ctx.answerCallbackQuery({
         text: "Sargydyň eyesi siz däl",
         show_alert: true,
      });
   }
   // user sum update
   const data =
      order.payment === "TMT"
         ? { sumTmt: order.user.sumTmt + order.product.priceTMT }
         : { sumUsdt: order.user.sumUsdt + order.product.priceUSDT };
   const userData = await prisma.user.update({
      where: {
         id: order.user.id,
      },
      data,
   });
   if (!userData) {
      console.log(err_6.d);
      return await ctx.answerCallbackQuery({
         text: err_6.m,
         show_alert: true,
      });
   }
   // preparing messages
   const ordIdMssg = ordrIdMssgFnc(order.id);
   const clntmssg = statusIcons.no[0] + " Sargyt ýatyryldy.";
   try {
      await ctx.editMessageText(`${ordIdMssg} ${clntmssg}`, {
         parse_mode: "HTML",
      });
   } catch (error) {
      console.error("SMS UPDATE ERROR::", error);
      await ctx.answerCallbackQuery({
         text: "Sargyt kabul edilyarka yalnyslyk doredi.",
         show_alert: true,
      });
   }
});
// if order aççepted by an admin
bot.callbackQuery(/deliverOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const adminId = ctx.from?.id;

   // admin checker
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      return await ctx.answerCallbackQuery({
         text: isAdmin.mssg,
         show_alert: true,
      });
   }

   // update and check order
   const order = await validator(
      orderId,
      ["accepted", "paid"],
      "delivering",
      adminId.toString()
   );
   if ("error" in order) {
      return await ctx.answerCallbackQuery({
         text: order.mssg,
         show_alert: true,
      });
   }
   if (order.mssgIds.length > 0) {
      ordrMsgEdtStts.set(order.id, { mssgIds: order.mssgIds });
   }
   const ordrMsgIds = ordrMsgEdtStts.get(orderId);

   if (ordrMsgIds?.mssgIds === undefined) {
      console.log(err_7.d);
      return await ctx.answerCallbackQuery({
         text: err_7.m,
         show_alert: true,
      });
   }

   try {
      const keyboard = new InlineKeyboard()
         .text("Tabşyrdym " + statusIcons.yes[2], "orderDelivered_" + order.id)
         .row()
         .text("Ýatyr " + statusIcons.no[2], "declineOrder_" + order.id)
         .row()
         .copyText(order.receiver, order.receiver);
      /* if (order.product.name === "jtn") {
         keyboard
            .row()
            .text("SMS kody sora 💬", "askCode_" + order.id + "_first");
      } */
      for (let i = 0; i < adminidS.length; i++) {
         await ctx.api.editMessageText(
            adminidS[i],
            ordrMsgIds?.mssgIds[i],
            `${ordrIdMssgFnc(order.id)} <blockquote expandable>${prdctDtlMssg(
               order.product.name,
               order.product.amount || 0,
               order.receiver,
               order.payment === "TMT"
                  ? order.product.priceTMT
                  : order.product.priceUSDT,
               order.payment,
               order.userId
            )}</blockquote> \n ${ordrDlvrng(adminId, ctx.from.first_name)}`,
            {
               reply_markup:
                  order.courierid === adminidS[i] ? keyboard : undefined,
               parse_mode: "HTML",
            }
         );
         if (order.courierid === adminidS[i]) {
            ctx.pinChatMessage(ordrMsgIds?.mssgIds[i]);
         }
      }

      const chatState = chatStates.get(Number(order.userId));
      if (order.product.chatRequired && chatState) {
         chatStates.set(Number(order.courierid), {
            userId: Number(order.userId),
            messageIds: [],
         });
         chatState.userId = Number(order.courierid);
      }
      await ctx.answerCallbackQuery({
         text: "Şahsy söhbetdeşlik başladyldy. Soňundan yapmagy ýatdan çykarmaň.",
         show_alert: true,
      });
   } catch (error) {
      console.error("SMS ERROR::", error);
      await ctx.answerCallbackQuery({
         text: "Sargyt kabul edilyarka yalnyslyk doredi.",
         show_alert: true,
      });
   }
});
// order decline by an admin
bot.callbackQuery(/declineOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const adminId = ctx.from?.id;
   // admin checker
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      return await ctx.answerCallbackQuery({
         text: isAdmin.mssg,
         show_alert: true,
      });
   }

   // order validator
   const order = await validator(
      orderId,
      ["accepted", "delivering", "paid"],
      "cancelled",
      adminId.toString()
   );
   if ("error" in order) {
      return await ctx.answerCallbackQuery({
         text: order.mssg,
         show_alert: true,
      });
   }
   if (order.mssgIds.length > 0) {
      ordrMsgEdtStts.set(order.id, { mssgIds: order.mssgIds });
   }
   const ordrMsgIds = ordrMsgEdtStts.get(orderId);
   if (!ordrMsgIds?.mssgIds) {
      console.log(err_7.d);
      return await ctx.answerCallbackQuery({
         text: err_7.m,
         show_alert: true,
      });
   }

   // user sum update
   const data =
      order.payment === "TMT"
         ? { sumTmt: order.user.sumTmt + order.product.priceTMT }
         : { sumUsdt: order.user.sumUsdt + order.product.priceUSDT };
   const userData = await prisma.user.update({
      where: {
         id: order.user.id,
      },
      data,
   });
   if (!userData) {
      console.log(err_6.d);
      return await ctx.answerCallbackQuery({
         text: err_6.m,
         show_alert: true,
      });
   }

   // preparing messages
   const askRsnMssg = `<b>${statusIcons.care[4]} Sargydyň ýatyrylmagynyň sebäbini ýazyň?!</b>`;
   const dslndMess = ordrDclngMssgFnc(adminId, ctx.from.first_name);
   const ordIdMssg = ordrIdMssgFnc(orderId);
   try {
      for (let i = 0; i < adminidS.length; i++) {
         await bot.api.editMessageText(
            adminidS[i],
            ordrMsgIds?.mssgIds[i],
            `${ordIdMssg} ${dslndMess} ${
               order.courierid === adminidS[i] ? "\n \n" + askRsnMssg : ""
            }`,
            {
               parse_mode: "HTML",
            }
         );
      }
      // yatyrma sebabi garasylyar
      reasonStates.set(adminId, {
         orderId: order.id,
         client: order.userId,
         mssgIds: ordrMsgIds.mssgIds,
      });
      ordrMsgEdtStts.delete(orderId);
   } catch (error) {
      console.error("BOT API ERR::", error);
      await ctx.answerCallbackQuery({
         text: "Bot api error.",
         show_alert: true,
      });
   }
});
// order complete command
bot.callbackQuery(/orderDelivered_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const adminId = ctx.from?.id;
   // validator
   const order = await validator(
      orderId,
      ["delivering"],
      "completed",
      adminId.toString()
   );
   if ("error" in order) {
      return await ctx.answerCallbackQuery({
         text: order.mssg,
         show_alert: true,
      });
   }

   // message ids
   const messageIds = ordrMsgEdtStts.get(orderId);
   if (!messageIds?.mssgIds) {
      console.log(err_7.d);
      return await ctx.answerCallbackQuery({
         text: err_7.m,
         show_alert: true,
      });
   }
   // preparing messages
   const ordIdmssg = ordrIdMssgFnc(orderId);
   const ordrCmltdMssg = ordrCmltdMssgFnc(ctx.from.id, ctx.from.first_name);
   try {
      for (let i = 0; i < adminidS.length; i++) {
         await bot.api.editMessageText(
            adminidS[i],
            messageIds?.mssgIds[i],
            `${ordIdmssg} <blockquote expandable>${prdctDtlMssg(
               order.product.name,
               order.product.amount || 0,
               order.receiver,
               order.payment === "TMT"
                  ? order.product.priceTMT
                  : order.product.priceUSDT,
               order.payment,
               order.userId
            )}</blockquote> \n ${ordrCmltdMssg}`,
            {
               parse_mode: "HTML",
            }
         );
      }

      await bot.api.sendMessage(
         order.userId,
         `${ordIdmssg} ${statusIcons.wait[0]} Sargadyňyz Tabşyryldy`,
         {
            parse_mode: "HTML",
         }
      );
      ordrMsgEdtStts.delete(order.id);
   } catch (error) {
      console.error("bot api error: ", error);
      await ctx.answerCallbackQuery({
         text: "bot api error",
         show_alert: true,
      });
   }
});

// add sum comand
bot.command(editSummComand, async (ctx) => {
   const userID = ctx.from?.id;
   const isAdmin = adminValid(userID);
   if (sumAddStates.get(userID)) {
      return ctx.deleteMessage();
   }
   if (chatStates.get(Number(userID))) {
      return ctx.reply(
         "Siz şu wagt söhbetdeşlikde, ilki söhbetdeşligi tamamlaň! \n /stop"
      );
   }
   // if user not admin notify admins
   if (isAdmin.error) {
      adminidS.map(async (adminId) => {
         await ctx.api.sendMessage(
            adminId,
            sspcsCaseMs(
               isAdmin.mssg,
               "/" + editSummComand,
               ctx.from?.username,
               ctx.from?.id
            )
         );
      });
      return ctx.reply(isAdmin.mssg);
   }
   // asking walnum
   const { message_id } = await ctx.reply(`Hasap nomer: ?`, {
      reply_markup: cnclAddSumBtnn(),
   });
   // open the state
   sumAddStates.set(userID, {
      mssgId: message_id,
      walNum: "",
      crrncy: "",
      sum: 0.0,
   });
   return;
});
// add sum crrcncy chooser
bot.callbackQuery(/^choose_(\w+)$/, (ctx) => {
   const adminId = ctx.from?.id;
   const sumAddState = sumAddStates.get(adminId);
   // if user not admin notify admins
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      adminidS.map(async (adminId) => {
         await ctx.api.sendMessage(
            adminId,
            sspcsCaseMs(
               isAdmin.mssg,
               "/" + editSummComand,
               ctx.from?.username,
               ctx.from?.id
            )
         );
      });
      return ctx.reply(isAdmin.mssg);
   }
   // set çurrençy
   if (sumAddState) {
      sumAddState.crrncy = ctx.match[1] as PaymentMethod;
   }
   // next message
   return ctx.editMessageText(
      /* adminId,
      sumAddState?.mssgId || 0, */
      `Hasap nomer: ${sumAddState?.walNum} \n Näçe ? ${sumAddState?.crrncy}`,
      {
         reply_markup: cnclAddSumBtnn(),
      }
   );
});
// complate add sum
bot.callbackQuery("complateAdd", async (ctx) => {
   const adminId = ctx.from?.id;
   const sumAddState = sumAddStates.get(adminId);
   const isAdmin = adminValid(adminId);
   // if user not admin notify admins
   if (isAdmin.error) {
      adminidS.map(async (adminId) => {
         await ctx.api.sendMessage(
            adminId,
            sspcsCaseMs(
               isAdmin.mssg,
               "/" + editSummComand,
               ctx.from?.username,
               ctx.from?.id
            )
         );
      });
      return ctx.reply(isAdmin.mssg);
   }
   // validating walnum exist
   const user = await prisma.user.findUnique({
      where: {
         walNum: sumAddState?.walNum,
      },
   });
   if (!user) {
      sumAddStates.delete(adminId);
      return ctx.editMessageText(
         "Yalnys beyle hasap nomer tapylmady, tazeden synansyn /" +
            editSummComand
      );
   }
   // validating if sum is correct
   const fltdSum = sumAddState?.sum;
   if (fltdSum === undefined || isNaN(fltdSum) || fltdSum === 0) {
      sumAddStates.delete(adminId);
      return ctx.editMessageText(
         "Yalnys pul mukdary dogry yazylmady, tazeden synansyn /" +
            editSummComand
      );
   }
   // is choosed currency correct
   const chsdCrrnc = sumAddState?.crrncy;
   if (typeof chsdCrrnc !== "string" || !(chsdCrrnc in PaymentMethod)) {
      sumAddStates.delete(adminId);
      return ctx.editMessageText(
         "Yalnys Walyuta, tazeden synansyn /" + editSummComand
      );
   }
   // choosing currency
   const data =
      sumAddState?.crrncy === "TMT"
         ? { sumTmt: Number((user.sumTmt + fltdSum).toFixed(2)) }
         : { sumUsdt: Number((user.sumUsdt + fltdSum).toFixed(2)) };
   // updating user sum
   const addSum = await prisma.user.update({
      where: {
         id: user.id,
      },
      data,
   });
   // if updating went wrong
   if (!addSum) {
      sumAddStates.delete(adminId);
      return ctx.editMessageText(
         "User Db update error, tazeden synansyn /" + editSummComand
      );
   }

   // save transaction to db
   const save = await prisma.summUpdate.create({
      data: {
         cashierid: adminId.toString(),
         clientid: user.id,
         currency: chsdCrrnc as PaymentMethod,
         sum: fltdSum,
      },
   });
   // if went wrong
   if (!save) {
      sumAddStates.delete(adminId);
      return ctx.api.editMessageText(
         adminId,
         sumAddState?.mssgId || 0,
         `Musderin hasaby kopeldildi yone proses hasaba alynmady. Bu bildirisi bellap goyun \n ${user.walNum}`
      );
   }
   sumAddStates.delete(adminId);
   try {
      adminidS.map((adminId) => {
         ctx.api.sendMessage(
            adminId,
            `Hasap +/- \n Kimden: ${userLink(
               Number(ctx.from.id),
               ctx.from.first_name
            )} \n Nirä: ${userLink(Number(user.id), user.walNum)} \n Mukdar: ${
               save.sum
            } ${save.currency}`,
            {
               parse_mode: "HTML",
            }
         );
      });
      ctx.api.sendMessage(
         user.id,
         `Hasabyňyz ${fltdSum} ${chsdCrrnc} ${
            fltdSum > 0 ? "köpeldi." : "azaldy."
         }`
      );
      return await ctx.deleteMessage();
   } catch (e) {
      console.error("bot api error: ", e);
      await ctx.editMessageText(
         "Proses tutush amala asyryldy yone adminlere habar berilmedi" + e
      );
   }
});
// cancel add sum comand
bot.callbackQuery("declineAdd", async (ctx) => {
   const adminId = ctx.from?.id;
   // if user not admin notify admins
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      adminidS.map(async (adminId) => {
         await ctx.api.sendMessage(
            adminId,
            sspcsCaseMs(
               isAdmin.mssg,
               "/" + editSummComand,
               ctx.from?.username,
               ctx.from?.id
            )
         );
      });
      return ctx.reply(isAdmin.mssg);
   }
   const sumAddState = sumAddStates.get(adminId);
   if (!sumAddState) {
      return ctx.editMessageText(
         "Hasap goşmak eýýäm ýatyryldy ýa-da amala aşyryldy ýa-da ýalňyşlyk döredi!"
      );
   }
   sumAddStates.delete(adminId);
   return await ctx.editMessageText("Hasap goşmak ýatyryldy.");
});

bot.callbackQuery(/^askPass_(\w+)_(\w+)$/, (ctx) => {
   //const adminId = ctx.from?.id;
   const userID = ctx.match[1];
   const again = ctx.match[2];
   const tikTokState = tikTokStates.get(userID.toString());
   if (tikTokState) {
      tikTokState.pass = "";
   }
   ctx.api.sendMessage(
      userID,
      again === "wrong"
         ? "TikTok parolyňyz ýalňyş gaýtadan ugradyň."
         : "TikTok parolyňyzy ugradyň!"
   );
   ctx.answerCallbackQuery({
      text: again === "wrong" ? "Parol gaytadan soraldy" : "Parol soraldy",
      show_alert: true,
   });
   ctx.deleteMessage();
});
bot.callbackQuery(/^askCode_(\w+)_(\w+)$/, async (ctx) => {
   //const adminId = ctx.from?.id;
   const adminId = ctx.from.id;
   const orderId = parseInt(ctx.match[1]);
   const again = ctx.match[2] === "again";

   // order validator
   const order = await validator(
      again
         ? tikTokStates.get(orderId.toString())?.orderId ?? orderId
         : orderId,
      ["delivering", "paid"],
      "delivering",
      adminId.toString()
   );
   if ("error" in order) {
      return await ctx.answerCallbackQuery({
         text: order.mssg,
         show_alert: true,
      });
   }

   const { message_id } = await ctx.api.sendMessage(
      order.userId,
      again
         ? "Bagyşlaň TikTok-dan gelen täze SMS koduny ugradyň."
         : "TikTok-dan gelen SMS koduny ugradyň."
   );
   tikTokStates.set(order.userId, {
      adminId: adminId,
      mssgId: message_id,
      orderId: orderId,
      code: "",
      pass: "",
   });
   ctx.answerCallbackQuery({
      text: "Kod soraldy",
      show_alert: true,
   });
   if (again) {
      ctx.deleteMessage();
   }
});

bot.callbackQuery(/^tiktokDone_(\w+)$/, (ctx) => {
   //const adminId = ctx.from?.id;
   const userID = ctx.match[1];
   tikTokStates.delete(userID);
   ctx.deleteMessage();
});

bot.on("message", async (ctx) => {
   const userId = ctx.chat.id;
   const reasonState = reasonStates.get(userId);
   const sumAddState = sumAddStates.get(userId);
   const tikTokState = tikTokStates.get(userId.toString());
   const chatState = chatStates.get(userId);
   // order declining reason
   if (chatState && chatState.userId) {
      if (ctx.message && !ctx.message.pinned_message) {
         // Eğer sabitlenmiş mesaj bildirimi değilse, mesajı kopyala
         try {
            await ctx.api.copyMessage(
               chatState.userId, // Bu kısım admin'in veya kullanıcının chat ID'si olmalı, duruma göre ayarlarsın.
               ctx.chat.id, // Mesajın geldiği chat ID'si
               ctx.message.message_id // Kopyalanacak mesajın ID'si
            );
            console.log("Mesaj başarıyla kopyalandı.");
         } catch (error) {
            console.error("Mesaj kopyalanırken bir hata oluştu:", error);
            // Hata yönetimi burada yapılabilir, örneğin kullanıcıya veya admin'e bilgi verme.
         }
      }
   } else if (reasonState) {
      const reason = ctx.message.text;
      const ordIdmess = ordrIdMssgFnc(reasonState.orderId);
      await bot.api.sendMessage(
         reasonState.client,
         `${ordIdmess}  ${ordrDclngMssgFnc(userId.toString(), false, reason, true)}`,
         {
            parse_mode: "HTML",
         }
      );
      for (let i = 0; i < adminidS.length; i++) {
         await bot.api.editMessageText(
            adminidS[i],
            reasonState.mssgIds[i],
            `${ordIdmess} ${ordrDclngMssgFnc(
               userId.toString(),
               ctx.from.first_name,
               reason
            )}`,
            {
               parse_mode: "HTML",
            }
         );
      }
      ctx.deleteMessage();
      reasonStates.delete(userId);
   } else if (sumAddState) {
      // addSumm data collector
      // collect walletNumber
      if (sumAddState.walNum === "") {
         if (!ctx.message.text) {
            sumAddStates.delete(userId);
            return ctx.reply("Hasap nomer girizilmedi. Başdan synanyşyň.");
         }
         sumAddState.walNum = ctx.message.text;
         ctx.api.editMessageText(
            userId,
            sumAddState.mssgId,
            `Hasap nomer: ${sumAddState.walNum} \n Walýuta ?`,
            {
               reply_markup: new InlineKeyboard()
                  .text("TMT", "choose_TMT")
                  .text("USDT", "choose_USDT")
                  .row()
                  .text("Goýbolsun " + statusIcons.care[7], "declineAdd"),
            }
         );
         return await ctx.deleteMessage();
      } else if (sumAddState.sum === 0.0) {
         // collect sum
         const sum = ctx.message.text;
         if (!sum && isNaN(Number(sum))) {
            sumAddStates.delete(userId);
            return ctx.reply("Girizen mukdaryňyz nädogry. Başdan synanyşyň.");
         }
         sumAddState.sum = Number(Number(sum).toFixed(2));
         ctx.deleteMessage();
         ctx.api.editMessageText(
            userId,
            sumAddState.mssgId,
            `Hasap nomer: ${sumAddState.walNum} \n ${sumAddState.sum} ${sumAddState.crrncy}`,
            {
               reply_markup: new InlineKeyboard()
                  .text("Ýalňyş", "declineAdd")
                  .text("Dogry", "complateAdd"),
            }
         );
      }
   } else if (tikTokState) {
      if (tikTokState.code === "") {
         tikTokState.code = ctx.message.text || "";
         await ctx.api.sendMessage(
            tikTokState.adminId,
            "Kod: " + tikTokState.code,
            {
               reply_markup: new InlineKeyboard()
                  .copyText(tikTokState.code, tikTokState.code)
                  .row()
                  .text("Paroly Sora", `askPass_${userId}_first`)
                  .row()
                  .text("Kody yene sora", `askCode_${userId}_again`)
                  .row()
                  .text("Tamamla", "tiktokDone_" + userId),
            }
         );
         await ctx.api.editMessageText(
            userId,
            tikTokState.mssgId,
            "SMS kody ugradyldy eger TikTok hasabyňyzyň paroly bar bolsa, az salym garaşyň. Sizden soralandan soň, parolyňyzy hem ugradyň."
         );
      } else if (tikTokState.pass === "" && tikTokState.code !== "") {
         tikTokState.pass = ctx.message.text || "";
         await ctx.api.sendMessage(tikTokState.adminId, tikTokState.pass, {
            reply_markup: new InlineKeyboard()
               .copyText(tikTokState.pass, tikTokState.pass)
               .row()
               .text("Parol Ýalňyş", `askPass_${userId}_wrong`)
               .row()
               .text("Tamampla", "tiktokDone_" + userId),
         });
         await ctx.api.editMessageText(
            userId,
            tikTokState.mssgId,
            "TikTok hasabybyňyzyň paroly dogry bolsa, sargydyňyz az salymdan tabşyrylar."
         );
      }
   }
});

bot.start();
