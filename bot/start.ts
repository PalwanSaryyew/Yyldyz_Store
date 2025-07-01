import { InlineKeyboard, Keyboard } from "grammy";
import { prisma } from "./prisma/prismaSett";
import { adminidS, editSummComand, statusIcons } from "./src/settings";
import { bot } from "./src/botConf";
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
   welcome,
} from "./src/messages";
import { cnclAddSumBtnn, dlvrOrdrKybrd } from "./src/keyboards";

const mainKEybiard = new Keyboard()
   .webApp("Dükana gir 🛒", "https://yyldyz.store")
   .row()
   .text("Balansy barla")
   .text("Admini çagyr")
   .resized()
   .persistent();

// for updating persistent buttons
/* bot.command("update", async (ctx) => {
   const isAmdin = isAdminId(ctx.from?.id);
   if (isAmdin.error) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---update komandada deleteMessage yalnyslygy---", e);
      });
   }

   const users = await prisma.user.findMany().catch((e) => {
      console.error("---update komandada prisma yalnyslygy---", e);
   });
   if (!users) {
      return;
   }

   console.log(
      `Persistent button updates are being sent to total of ${users.length} users...`
   );

   for (const user of users) {
      try {
         await bot.api.sendMessage(user.id, "Bagyşlaň düwmeleri täzeledik.", {
            reply_markup: mainKEybiard,
         });
         console.log(`Message Sent: ${user.id}`);
         // You can add a small delay for the speed limit (e.g. 50-100ms)
         await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: any) {
         console.error(`Error sending message ${user.id}:`, error);
         // If the user blocked the bot or there is another error
         if (
            error.description &&
            error.description.includes("bot was blocked by the user")
         ) {
            console.log(`User blocked the bot, ${user.id}`);
         }
         // You can do different things for other errors.
      }
   }

   await ctx
      .reply(
         "Köpçülikleýin Täzeleme prosesi tamamlandy (nogsanlyklar bolup biler)."
      )
      .catch((e) => {
         console.error("---update komandada reply yalnyslygy---", e);
      });
}); */

// sending bulk messages
bot.command("broadcast", async (ctx) => {
   const isAmdin = isAdminId(ctx.from?.id);
   if (isAmdin.error) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---brodcast komandada deleteMessage yalnyslygy---", e);
      });
   }

   if (ctx.from?.id !== undefined) {
      ctx.session.broadcastStates[ctx.from.id] = { message: "" };
      ctx.reply("Texti ugradyn", {
         reply_markup: new InlineKeyboard().text(
            "Ýatyr",
            "cancelBroad_" + ctx.from.id
         ),
      }).catch((e) => {
         console.error("---brodcast komandada reply yalnyslygy---", e);
      });
   }
});
// cancel sending bulk messages
bot.callbackQuery(/cancelBroad_(.+)/, async (ctx) => {
   delete ctx.session.broadcastStates[ctx.from.id];
   ctx.answerCallbackQuery({ text: "Yatyryldy", show_alert: true }).catch(
      (e) => {
         console.error(
            "---cancelBroad duwmesinde answerCallbackQuery yalnyslygy---",
            e
         );
      }
   );
});

// calling an admin
bot.hears("Admini çagyr", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return;
   }
   if (ctx.session.chatStates[userID]) {
      return await ctx
         .reply(
            "Siz häzir hem admin bilen söhbetdeşlikde. Öňki söhbetdeşligi ýapmak üçin 👉 /stop 👈"
         )
         .catch((e) => {
            console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
         });
   }
   if (isAdminId(userID).error === false) {
      return await ctx.reply("Admin admini çagyryp bilmeýär!").catch((e) => {
         console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
      });
   }
   const messageIds: number[] = [];
   for (const adminId of adminidS) {
      try {
         const { message_id } = await ctx.api.sendMessage(
            adminId,
            `${userLink({
               id: userID,
               nick: ctx.from?.first_name,
            })}${
               ctx.from?.username !== undefined
                  ? ` / @${ctx.from?.username}`
                  : ""
            } söhbetdeşlik talap edýär`,
            {
               reply_markup: new InlineKeyboard().text(
                  "Tassykla",
                  "acceptChat_" + userID
               ),
               parse_mode: "HTML",
            }
         );

         messageIds.push(message_id);
      } catch (e) {
         console.error(
            "---Admini çagyr duwmesinde for-sendMessage yalnyslygy---",
            e
         );
      }
   }
   ctx.session.chatStates[userID] = {
      userId: 0,
      username: ctx.from?.username,
      messageIds: messageIds,
   };
   ctx.reply(
      "Admin söhbetdeşligi kabul etýänçä garaşyň. Size habar beriler."
   ).catch((e) => {
      console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
   });
});
bot.command("cagyr", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return;
   }
   if (ctx.session.chatStates[userID]) {
      return await ctx
         .reply(
            "Siz häzir hem söhbetdeşlikde. Öňki söhbetdeşligi ýapmak üçin 👉 /stop 👈"
         )
         .catch((e) => {
            console.error("--- çagyr komandynda reply yalnyslygy---", e);
         });
   }
   if (isAdminId(userID).error === true) {
      return await ctx
         .reply("Bul komandy diňe adminler ulanyp bilýär!")
         .catch((e) => {
            console.error("---çagyr komandynda reply yalnyslygy---", e);
         });
   }

   const messageIds: number[] = [];
   /* for (const adminId of adminidS) {
      try {
         const { message_id } = await ctx.api.sendMessage(
            adminId,
            `${userLink({
               id: userID,
               nick: ctx.from?.first_name,
            })}${
               ctx.from?.username !== undefined
                  ? ` / @${ctx.from?.username}`
                  : ""
            } söhbetdeşlik talap edýär`,
            {
               reply_markup: new InlineKeyboard().text(
                  "Tassykla",
                  "acceptChat_" + userID
               ),
               parse_mode: "HTML",
            }
         );

         messageIds.push(message_id);
      } catch (e) {
         console.error(
            "---Admini çagyr duwmesinde for-sendMessage yalnyslygy---",
            e
         );
      }
   } */

   ctx.session.chatStates[userID] = {
      userId: 0,
      messageIds: messageIds,
      calling: true,
   };
   return ctx.reply("ID ugradyň.").catch((e) => {
      console.error("---çagyr komandynda reply yalnyslygy---", e);
   });
});
bot.callbackQuery(/acceptChat_(.+)/, async (ctx) => {
   const acceptorId = ctx.from.id;
   const userID = parseInt(ctx.match[1]);
   const chatState = ctx.session.chatStates[userID];

   if (!chatState || !userID || !acceptorId) {
      return ctx.reply("Yalnyslyk");
   }
   if (ctx.session.chatStates[acceptorId]) {
      return ctx
         .answerCallbackQuery({
            text: "Siz öňem sohbetdeşlikde, ilki öňki söhbetdeşligi tamamlaň! \n /stop",
            show_alert: true,
         })
         .catch((e) => {
            console.error(
               "---acceptChat duwmesinde answerCallbackQuery yalnyslygy---",
               e
            );
         });
   }
   chatState.userId = acceptorId;
   ctx.session.chatStates[acceptorId] = {
      userId: userID,
      messageIds: chatState.messageIds,
   };
   if (chatState.messageIds.length > 0) {
      for (let i = 0; i < adminidS.length; i++) {
         try {
            await ctx.api.editMessageText(
               adminidS[i],
               chatState?.messageIds[i],
               `${userLink({
                  id: acceptorId,
                  nick: ctx.from.first_name,
               })} bilen ${userLink({ id: userID })}${
                  chatState.username !== undefined
                     ? ` / @${chatState.username}`
                     : ""
               } söhbetdeşlik edýär.`,
               { parse_mode: "HTML" }
            );
            if (acceptorId.toString() === adminidS[i]) {
               ctx.pinChatMessage(chatState?.messageIds[i]);
            }
         } catch (e) {
            console.error(
               "---acceptChat duwmesinde fot-editMessageText yalnyslygy---",
               e
            );
         }
      }
   } else {
      ctx.editMessageText(
         "Söhbetdeşlik kabul edildi. Mundan beýläk söhbetdeşlik ýapylýança, ugradan zatlaryňyz garşy tarapa barar."
      ).catch((e) => {
         console.error(
            "---acceptChat duwmesinde editMessageText yalnyslygy---",
            e
         );
      });
   }
   await ctx.api
      .sendMessage(
         userID,
         "Söhbetdeşlik kabul edildi. Mundan beýläk söhbetdeşlik ýapylýança, ugradan zatlaryňyz garşy tarapa barar."
      )
      .catch((e) => {
         console.error("---acceptChat duwmesinde sendMessage yalnyslygy---", e);
      });
});
bot.command("stop", async (ctx) => {
   const userID = ctx.from?.id || 0;
   const isAmdin = isAdminId(userID);
   const chatState = ctx.session.chatStates[userID];
   if (!userID || !chatState) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---stop komandasynda deleteMessage yalnyslygy---", e);
      });
   }

   await ctx.reply(`Söhbetdeşlik tamamlandy.`).catch((e) => {
      console.error("---stop komandasynda reply yalnyslygy---", e);
   });
   if (chatState.userId !== 0) {
      await ctx.api
         .sendMessage(
            chatState.userId,
            `<blockquote>bot</blockquote> Söhbetdeşlik tamamlandy.`,
            { parse_mode: "HTML" }
         )
         .catch((e) => {
            console.error("---stop komandasynda sendMessage yalnyslygy---", e);
         });
   }
   if (chatState.messageIds.length > 0) {
      for (let i = 0; i < adminidS.length; i++) {
         const messageToSend = isAmdin.error
            ? `${userLink({
                 id: userID,
                 nick: ctx.from?.first_name,
              })}${
                 ctx.from?.username ? ` / @${ctx.from?.username}` : ""
              }\n${userLink({
                 id: chatState.userId,
              })} bilen söhbetdeşligi tamamlady`
            : `${userLink({
                 id: userID,
                 nick: ctx.from?.first_name,
              })}\n${userLink({
                 id: chatState.userId,
              })}${
                 ctx.session.chatStates[chatState.userId].username !== undefined
                    ? ` / @${ctx.session.chatStates[chatState.userId].username}`
                    : ""
              } bilen söhbetdeşligi tamamlady.`;
         try {
            await ctx.api.editMessageText(
               adminidS[i],
               chatState?.messageIds[i],
               messageToSend,
               { parse_mode: "HTML" }
            );

            if (userID.toString() === adminidS[i]) {
               ctx.unpinChatMessage(chatState?.messageIds[i]);
            } else if (chatState.userId.toString() === adminidS[i]) {
               ctx.api.unpinChatMessage(adminidS[i], chatState?.messageIds[i]);
            }
         } catch (e) {
            console.error(
               "---stop komandasynda fot-editMessageText yalnyslygy---",
               e
            );
         }
      }
   }

   delete ctx.session.chatStates[userID];
   delete ctx.session.chatStates[chatState.userId];
});

bot.command("on", async (ctx) => {
   const userID = ctx.from?.id;

   if (!userID) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---on komandasynda deleteMessage yalnyslygy---", e);
      });
   }
   const isAmdin = isAdminId(userID);
   if (isAmdin.error) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---on komandasynda deleteMessage yalnyslygy---", e);
      });
   }
   const status = await prisma.admin
      .update({
         where: {
            tgId: userID.toString(),
         },
         data: {
            onlineSatus: true,
         },
      })
      .catch((e) => {
         console.error("---on komandasynda prisma yalnyslygy---", e);
      });
   if (status) {
      return ctx.reply("Siz Online " + statusIcons.yes[3]).catch((e) => {
         console.error("---on komandasynda reply yalnyslygy---", e);
      });
   } else {
      return ctx.deleteMessage().catch((e) => {
         console.error("---on komandasynda deleteMessage yalnyslygy---", e);
      });
   }
});
bot.command("of", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---of komandasynda deleteMessage yalnyslygy---", e);
      });
   }
   const isAmdin = isAdminId(userID);
   if (isAmdin.error) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---of komandasynda deleteMessage yalnyslygy---", e);
      });
   }
   const status = await prisma.admin
      .update({
         where: {
            tgId: userID.toString(),
         },
         data: {
            onlineSatus: false,
         },
      })
      .catch((e) => {
         console.error("---of komandasynda prisma yalnyslygy---", e);
      });
   if (status) {
      return ctx.reply("Siz Offline " + statusIcons.no[3]).catch((e) => {
         console.error("---of komandasynda reply yalnyslygy---", e);
      });
   } else {
      return ctx.deleteMessage().catch((e) => {
         console.error("---of komandasynda deleteMessage yalnyslygy---", e);
      });
   }
});

/* start command */
bot.command("test", async (ctx) => {
   ctx.reply(`${statusIcons.yes} \n ${statusIcons.no} \n ${statusIcons.care}`, {
      parse_mode: "HTML",
   }).catch((e) => {
      console.error("---test komandasynda reply yalnyslygy---", e);
   });
});
bot.hears("Dükana gir 🛒", async (ctx) => {
   ctx.reply("Dükana girmek üçin aşaky düwma basyň.", {
      reply_markup: new InlineKeyboard().webApp(
         "Söwda 🛒",
         "https://yyldyz.store"
      ),
   }).catch((e) => {
      console.error("---Dükana gir dinleyjisinde reply yalnyslygy---", e);
   });
});
bot.command("start", async (ctx) => {
   const userID = ctx.from?.id;
   // çreating user to do geting message permission
   const user = await userValid(userID, true);
   if ("error" in user) {
      return ctx.reply(user.mssg + " \n Täzeden synanşyň /start").catch((e) => {
         console.error("---start komandynda reply yalnyslygy---", e);
      });
   }

   ctx.reply(welcome, {
      reply_markup: mainKEybiard,
      parse_mode: "HTML",
   }).catch((e) => {
      console.error("---start komandynda reply yalnyslygy---", e);
   });
});

// hasap command
bot.hears("Balansy barla", async (ctx) => {
   const userID = ctx.from?.id;
   // geting user
   const user = await userValid(userID);
   if ("error" in user) {
      return ctx
         .reply(
            user.mssg +
               " \n Täzeden synanşyň /hasap \n ýada /start berip boty başladyň"
         )
         .catch((e) => {
            console.error("---Balansy barla dinleyjide reply yalnyslygy---", e);
         });
   }
   ctx.reply(hspMsg(user.walNum, user.sumTmt, user.sumUsdt), {
      reply_markup: new InlineKeyboard().copyText(user.walNum, user.walNum),
      parse_mode: "HTML",
   }).catch((e) => {
      console.error("---Balansy barla dinleyjide reply yalnyslygy---", e);
   });
});
// if order aççept by the çlient
bot.callbackQuery(/acceptOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const clntID = ctx.from.id;

   //caht id comes ?
   const chatId = chatIdV(clntID);
   if (chatId.error) {
      return await ctx
         .answerCallbackQuery({
            text: chatId.mssg,
            show_alert: true,
         })
         .catch((e) => {
            console.error(
               "---acceptOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            );
         });
   }
   // validates and turnes order details
   const order = await validator(orderId, ["pending"], "accepted");
   if ("error" in order) {
      return await ctx
         .answerCallbackQuery({
            text: order.mssg,
            show_alert: true,
         })
         .catch((e) => {
            console.error(
               "---acceptOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            );
         });
   }
   // order belongs to ovner of wallet ?
   if (order.userId !== clntID.toString()) {
      return await ctx
         .answerCallbackQuery({
            text: "Sargydyň eyesi siz däl",
            show_alert: true,
         })
         .catch((e) => {
            console.error(
               "---acceptOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            );
         });
   }
   // preparing messages
   const ordIdMssg = ordrIdMssgFnc(order.id);
   try {
      // sending messages to admins and collecting messages ids orderly
      const mssgIds: number[] = [];
      for (const adminid of adminidS) {
         try {
            const data = await bot.api.sendMessage(
               adminid,
               `${ordIdMssg} ${prdctDtlMssg({
                  order: order,
                  forWhom: "admin",
               })}`,
               {
                  reply_markup: dlvrOrdrKybrd(order),
                  parse_mode: "HTML",
               }
            );
            mssgIds.push(data.message_id);
         } catch (e) {
            console.error(
               "---acceptOrder duwmesinde for-sendMessage yalnyslygy---",
               e
            );
         }
      }
      ctx.session.ordrMsgEdtStts[orderId] = { mssgIds: mssgIds };

      let adminOnlineStatus = false;

      const clntmssg = `${statusIcons.care[1]} ${
         order.product.chatRequired
            ? `Sargydyňyz alyndy, bu sargydy tabşyrmak üçin käbir maglumatlar gerek, ${
                 adminOnlineStatus
                    ? "admin size ýazar haýyş garaşyň"
                    : "ýöne şu waglykça adminlaryň hiçbiri online däl. Sargydyňyzy ýatyryp ýa-da adminlardan biri size ýazýança garaşyp bilersiňiz"
              }.`
            : "Sargydyňyz alyndy, mümkin bolan iň gysga wagtda size gowşurylar."
      }`;

      await ctx
         .editMessageText(
            `${ordIdMssg} <blockquote expandable>${prdctDtlMssg({
               order: order,
               forWhom: "client",
            })}</blockquote> \n ${clntmssg}`,
            {
               parse_mode: "HTML",
               reply_markup:
                  (order.product.chatRequired === false &&
                     !adminOnlineStatus) ||
                  adminOnlineStatus
                     ? undefined
                     : new InlineKeyboard().text(
                          "Ýatyr " + statusIcons.no[2],
                          "cancelOrder_" + order.id
                       ),
            }
         )
         .catch((e) =>
            console.error(
               "---acceptOrder duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   } catch (error) {
      console.error("SMS ERROR::", error);
      await ctx
         .answerCallbackQuery({
            text: "Sargyt kabul edilyarka yalnyslyk doredi.",
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---acceptOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }
});
// if order çançelled by client
bot.callbackQuery(/cancelOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const clntID = ctx.from.id;

   const chatId = chatIdV(clntID);
   if (chatId.error) {
      return await ctx
         .answerCallbackQuery({
            text: chatId.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---cancelOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   // validates and turnes order details
   const order = await validator(orderId, ["pending"], "cancelled");
   if ("error" in order) {
      return await ctx
         .answerCallbackQuery({
            text: order.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---cancelOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   if (order.userId !== clntID.toString()) {
      return await ctx
         .answerCallbackQuery({
            text: "Sargydyň eyesi siz däl",
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---cancelOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }
   // user sum update
   const data =
      order.payment === "TMT"
         ? { sumTmt: order.user.sumTmt + order.product.priceTMT }
         : { sumUsdt: order.user.sumUsdt + order.product.priceUSDT };
   const userData = await prisma.user
      .update({
         where: {
            id: order.user.id,
         },
         data,
      })
      .catch((e) =>
         console.error("---cancelOrder duwmesinde prisma yalnyslygy---", e)
      );
   if (!userData) {
      console.log(err_6.d);
      return await ctx
         .answerCallbackQuery({
            text: err_6.m,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---cancelOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }
   // preparing messages
   const ordIdMssg = ordrIdMssgFnc(order.id);
   const clntmssg = statusIcons.no[0] + " Sargyt ýatyryldy.";
   try {
      await ctx
         .editMessageText(`${ordIdMssg} ${clntmssg}`, {
            parse_mode: "HTML",
         })
         .catch((e) =>
            console.error(
               "---cancelOrder duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   } catch (error) {
      console.error("SMS UPDATE ERROR::", error);
      await ctx
         .answerCallbackQuery({
            text: "Sargyt kabul edilyarka yalnyslyk doredi.",
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---cancelOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }
});
// if order aççepted by an admin
bot.callbackQuery(/deliverOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const adminId = ctx.from?.id;

   // admin checker
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      return await ctx
         .answerCallbackQuery({
            text: isAdmin.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---deliverOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   // update and check order
   const order = await validator(
      orderId,
      ["accepted", "paid"],
      "delivering",
      adminId.toString()
   );
   if ("error" in order) {
      await ctx
         .answerCallbackQuery({
            text: order.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---deliverOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error(
               "---deliverOrder duwmesinde deleteMessage yalnyslygy---",
               e
            )
         );
   }
   if (order.mssgIds.length > 0) {
      ctx.session.ordrMsgEdtStts[order.id] = { mssgIds: order.mssgIds };
   }
   const ordrMsgIds = ctx.session.ordrMsgEdtStts[orderId];

   if (ordrMsgIds?.mssgIds === undefined) {
      console.log(err_7.d);
      return await ctx
         .answerCallbackQuery({
            text: err_7.m,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---deliverOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   try {
      const keyboard = new InlineKeyboard()
         .text("Tabşyrdym " + statusIcons.yes[2], "orderDelivered_" + order.id)
         .row()
         .text("Ýatyr " + statusIcons.no[2], "declineOrder_" + order.id)
         .row()
         .copyText(order.receiver, order.receiver);
      for (let i = 0; i < adminidS.length; i++) {
         try {
            await ctx.api.editMessageText(
               adminidS[i],
               ordrMsgIds?.mssgIds[i],
               `${ordrIdMssgFnc(
                  order.id
               )} <blockquote expandable>${prdctDtlMssg({
                  order: order,
                  forWhom: "admin",
               })}</blockquote> \n ${ordrDlvrng(adminId, ctx.from.first_name)}`,
               {
                  reply_markup:
                     order.courierid === adminidS[i] ? keyboard : undefined,
                  parse_mode: "HTML",
               }
            );
            if (order.courierid === adminidS[i]) {
               ctx.pinChatMessage(ordrMsgIds?.mssgIds[i]);
            }
         } catch (e) {
            console.error(
               "---deliverOrder duwmesinde for-editMessageText yalnyslygy---",
               e
            );
         }
      }
   } catch (error) {
      console.error("SMS ERROR::", error);
      await ctx
         .answerCallbackQuery({
            text: "Sargyt kabul edilyarka yalnyslyk doredi.",
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---deliverOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }
});
// order decline by an admin
bot.callbackQuery(/declineOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const adminId = ctx.from?.id;
   /* if (ctx.session.chatStates[adminId]) {
      return await ctx
         .answerCallbackQuery({
            text: "Siz häzir hem söhbetdeşlikde. Öňki söhbetdeşligi ýapmak üçin 👉 /stop 👈",
            show_alert: true,
         })
         .catch((e) => {
            console.error(
               "---declineOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            );
         });
   } */
   // admin checker
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      return await ctx
         .answerCallbackQuery({
            text: isAdmin.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---declineOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   // order validator
   const order = await validator(
      orderId,
      ["accepted", "delivering", "paid"],
      "cancelled",
      adminId.toString()
   );
   if ("error" in order) {
      await ctx
         .answerCallbackQuery({
            text: order.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---declineOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error(
               "---declineOrder duwmesinde deleteMessage yalnyslygy---",
               e
            )
         );
   }
   if (order.mssgIds.length > 0) {
      ctx.session.ordrMsgEdtStts[order.id] = { mssgIds: order.mssgIds };
   }
   const ordrMsgIds = ctx.session.ordrMsgEdtStts[orderId];
   if (!ordrMsgIds?.mssgIds) {
      console.log(err_7.d);
      return await ctx
         .answerCallbackQuery({
            text: err_7.m,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---declineOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   // user sum update
   const data =
      order.payment === "TMT"
         ? { sumTmt: order.user.sumTmt + order.product.priceTMT }
         : { sumUsdt: order.user.sumUsdt + order.product.priceUSDT };
   const userData = await prisma.user
      .update({
         where: {
            id: order.user.id,
         },
         data,
      })
      .catch((e) =>
         console.error("---declineOrder duwmesinde prisma yalnyslygy---", e)
      );
   if (!userData) {
      console.log(err_6.d);
      return await ctx
         .answerCallbackQuery({
            text: err_6.m,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---declineOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   // preparing messages
   const askRsnMssg = `<b>${statusIcons.care[4]} Sargydyň ýatyrylmagynyň sebäbini ýazyň?!</b>`;
   const dslndMess = ordrDclngMssgFnc(adminId, ctx.from.first_name);
   const ordIdMssg = ordrIdMssgFnc(orderId);
   try {
      for (let i = 0; i < adminidS.length; i++) {
         try {
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
            if (adminidS[i] === order.courierid) {
               ctx.unpinChatMessage(ordrMsgIds?.mssgIds[i]);
            }
         } catch (error) {
            console.error(
               "---declineOrder duwmesinde for-editMessageText yalnyslygy---",
               error
            );
         }
      }
      // yatyrma sebabi garasylyar
      ctx.session.reasonStates[adminId] = {
         orderId: order.id,
         client: order.userId,
         mssgIds: ordrMsgIds.mssgIds,
      };
      delete ctx.session.ordrMsgEdtStts[orderId];
   } catch (error) {
      console.error("BOT API ERR::", error);
      await ctx
         .answerCallbackQuery({
            text: "Bot api error.",
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---declineOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
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
      return await ctx
         .answerCallbackQuery({
            text: order.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---orderDelivered duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }

   // message ids
   const messageIds = ctx.session.ordrMsgEdtStts[orderId];
   if (!messageIds?.mssgIds) {
      console.log(err_7.d);
      return await ctx
         .answerCallbackQuery({
            text: err_7.m,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---orderDelivered duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }
   // preparing messages
   const ordIdmssg = ordrIdMssgFnc(orderId);
   const ordrCmltdMssg = ordrCmltdMssgFnc(ctx.from.id, ctx.from.first_name);
   try {
      for (let i = 0; i < adminidS.length; i++) {
         try {
            await bot.api.editMessageText(
               adminidS[i],
               messageIds?.mssgIds[i],
               `${ordIdmssg} <blockquote expandable>${prdctDtlMssg({
                  order: order,
                  forWhom: "admin",
               })}</blockquote> \n ${ordrCmltdMssg}`,
               {
                  parse_mode: "HTML",
               }
            );
            if (order.courierid === adminidS[i]) {
               ctx.unpinChatMessage(messageIds?.mssgIds[i]);
            }
         } catch (e) {
            console.error(
               "---orderDelivered duwmesinde for-editMessageText yalnyslygy---",
               e
            );
         }
      }

      await bot.api
         .sendMessage(
            order.userId,
            `${ordIdmssg} ${statusIcons.wait[0]} Sargadyňyz Tabşyryldy`,
            {
               parse_mode: "HTML",
            }
         )
         .catch((e) =>
            console.error(
               "---orderDelivered duwmesinde sendMessage yalnyslygy---",
               e
            )
         );
      delete ctx.session.ordrMsgEdtStts[order.id];
   } catch (error) {
      console.error("bot api error: ", error);
      await ctx
         .answerCallbackQuery({
            text: "bot api error",
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---orderDelivered duwmesinde answerCallbackQuery yalnyslygy---",
               e
            )
         );
   }
});

// add sum comand
bot.command("check", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error("---check komandynda deleteMessage yalnyslygy---", e)
         );
   }
   if (ctx.session.checkStates[userID]) {
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error("---check komandynda deleteMessage yalnyslygy---", e)
         );
   }
   if (ctx.session.chatStates[Number(userID)]) {
      return ctx
         .reply(
            "Siz şu wagt söhbetdeşlikde, ilki söhbetdeşligi tamamlaň! \n /stop"
         )
         .catch((e) =>
            console.error("---check komandynda reply yalnyslygy---", e)
         );
   }
   // if user not admin notify admins
   const isAdmin = adminValid(userID);
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
   const message = await ctx
      .reply(`Hasap nomer ýa-da tg ID: ?`, {
         reply_markup: new InlineKeyboard().text("Yatyr", "declineCheck"),
      })
      .catch((e) =>
         console.error("---check komandynda reply yalnyslygy---", e)
      );
   // open the state
   ctx.session.checkStates[userID] = {
      messageId: message?.message_id || 0,
   };
   return;
});
bot.command(editSummComand, async (ctx) => {
   const userID = ctx.from?.id;
   const isAdmin = adminValid(userID);
   if (ctx.session.sumAddStates[userID || 0]) {
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error(
               "---editSummComand komandynda deleteMessage yalnyslygy---",
               e
            )
         );
   }
   /* if (ctx.session.chatStates[Number(userID)]) {
      return ctx
         .reply(
            "Siz şu wagt söhbetdeşlikde, ilki söhbetdeşligi tamamlaň! \n /stop"
         )
         .catch((e) =>
            console.error("---editSummComand komandynda reply yalnyslygy---", e)
         );
   } */
   // if user not admin notify admins
   if (isAdmin.error) {
      adminidS.map(async (adminId) => {
         try {
            await ctx.api.sendMessage(
               adminId,
               sspcsCaseMs(
                  isAdmin.mssg,
                  "/" + editSummComand,
                  ctx.from?.username,
                  ctx.from?.id
               )
            );
         } catch (error) {
            console.error(
               "---editSummComand komandasynda map-sendMessage yalnyslygy---",
               error
            );
         }
      });
      return ctx
         .reply(isAdmin.mssg)
         .catch((e) =>
            console.error("---editSummComand komandynda reply yalnyslygy---", e)
         );
   }
   // asking walnum
   const message = await ctx
      .reply(`Balans ID ýa-da Telegram ID: ?`, {
         reply_markup: cnclAddSumBtnn(),
      })
      .catch((e) =>
         console.error("---editSummComand komandynda reply yalnyslygy---", e)
      );
   // open the state
   ctx.session.sumAddStates[userID || 0] = {
      mssgId: message?.message_id || 0,
      walNum: "",
      crrncy: "",
      sum: 0.0,
   };
   return;
});
// add sum crrcncy chooser
bot.callbackQuery(/^choose_(\w+)$/, (ctx) => {
   const adminId = ctx.from?.id;
   const sumAddState = ctx.session.sumAddStates[adminId];
   // if user not admin notify admins
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      adminidS.map(async (adminId) => {
         try {
            await ctx.api.sendMessage(
               adminId,
               sspcsCaseMs(
                  isAdmin.mssg,
                  "/" + editSummComand,
                  ctx.from?.username,
                  ctx.from?.id
               )
            );
         } catch (error) {
            console.error(
               "---choose duwmesinde map-sendMessage yalnyslygy---",
               error
            );
         }
      });
      return ctx.reply(isAdmin.mssg);
   }
   // set çurrençy
   if (sumAddState) {
      sumAddState.crrncy = ctx.match[1] as PaymentMethod;
   }
   // next message
   return ctx
      .editMessageText(
         /* adminId,
      sumAddState?.mssgId || 0, */
         `Hasap nomer: ${sumAddState?.walNum} \n Näçe ? ${sumAddState?.crrncy}`,
         {
            reply_markup: cnclAddSumBtnn(),
         }
      )
      .catch((e) =>
         console.error(
            "---editSummComand komandynda editMessageText yalnyslygy---",
            e
         )
      );
});
// complate add sum
bot.callbackQuery("complateAdd", async (ctx) => {
   const adminId = ctx.from?.id;
   const sumAddState = ctx.session.sumAddStates[adminId];
   const isAdmin = adminValid(adminId);
   // if user not admin notify admins
   if (isAdmin.error) {
      try {
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
      } catch (error) {
         console.error(
            "---complateAdd duwmesinde map-sendMessage yalnyslygy---",
            error
         );
      }
      return ctx
         .reply(isAdmin.mssg)
         .catch((e) =>
            console.error("---complateAdd duwmesinde reply yalnyslygy---", e)
         );
   }
   // validating walnum exist
   let user;
   const fromId = await prisma.user
      .findUnique({
         where: { id: sumAddState.walNum },
      })
      .catch((e) => console.error("---checkState prisma yalnyslygy---", e));
   if (fromId) {
      user = fromId;
   } else {
      const formWal = await prisma.user
         .findUnique({
            where: { walNum: sumAddState.walNum },
         })
         .catch((e) => console.error("---checkState prisma yalnyslygy---", e));
      if (formWal) {
         user = formWal;
      }
   }
   if (!user) {
      delete ctx.session.sumAddStates[adminId];
      return ctx
         .editMessageText(
            "Yalnys beyle hasap nomer tapylmady, tazeden synansyn /" +
               editSummComand
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   }
   // validating if sum is correct
   const fltdSum = sumAddState?.sum;
   if (fltdSum === undefined || isNaN(fltdSum) || fltdSum === 0) {
      delete ctx.session.sumAddStates[adminId];
      return ctx
         .editMessageText(
            "Yalnys pul mukdary dogry yazylmady, tazeden synansyn /" +
               editSummComand
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   }
   // is choosed currency correct
   const chsdCrrnc = sumAddState?.crrncy;
   if (typeof chsdCrrnc !== "string" || !(chsdCrrnc in PaymentMethod)) {
      delete ctx.session.sumAddStates[adminId];
      return ctx
         .editMessageText("Yalnys Walyuta, tazeden synansyn /" + editSummComand)
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   }
   // choosing currency
   const data =
      sumAddState?.crrncy === "TMT"
         ? { sumTmt: Number((user.sumTmt + fltdSum).toFixed(2)) }
         : { sumUsdt: Number((user.sumUsdt + fltdSum).toFixed(2)) };
   // updating user sum
   const addSum = await prisma.user
      .update({
         where: {
            id: user.id,
         },
         data,
      })
      .catch((e) =>
         console.error("---complateAdd duwmesinde prisma yalnyslygy---", e)
      );
   // if updating went wrong
   if (!addSum) {
      delete ctx.session.sumAddStates[adminId];
      return ctx
         .editMessageText(
            "User Db update error, tazeden synansyn /" + editSummComand
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   }

   // save transaction to db
   const save = await prisma.summUpdate
      .create({
         data: {
            cashierid: adminId.toString(),
            clientid: user.id,
            currency: chsdCrrnc as PaymentMethod,
            sum: fltdSum,
         },
      })
      .catch((e) =>
         console.error("---complateAdd duwmesinde prisma yalnyslygy---", e)
      );
   // if went wrong
   if (!save) {
      delete ctx.session.sumAddStates[adminId];
      return ctx.api
         .editMessageText(
            adminId,
            sumAddState?.mssgId || 0,
            `Musderin hasaby kopeldildi yone proses hasaba alynmady. Bu bildirisi bellap goyun \n ${user.walNum}`
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   }
   delete ctx.session.sumAddStates[adminId];
   try {
      adminidS.map((adminId) => {
         ctx.api.sendMessage(
            adminId,
            `Hasap +/- \n Kimden: ${userLink({
               id: Number(ctx.from.id),
               nick: ctx.from.first_name,
            })} \n Nirä: ${userLink({
               id: Number(user.id),
               nick: user.walNum,
            })} \n Mukdar: ${save.sum} ${save.currency}`,
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
      console.error(
         "---complateAdd duwmesinde editMessageText yalnyslygy---",
         e
      );
      await ctx
         .editMessageText(
            "Proses tutush amala asyryldy yone adminlere yada ulanyja habar berilmedi" +
               e
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   }
});
// cancel add sum comand
bot.callbackQuery("declineAdd", async (ctx) => {
   const adminId = ctx.from?.id;
   // if user not admin notify admins
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      try {
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
      } catch (error) {
         console.error(
            "---declineAdd duwmesinde map-sendMessage yalnyslygy---",
            error
         );
      }
      return ctx
         .reply(isAdmin.mssg)
         .catch((e) =>
            console.error("---declineAdd duwmesinde reply yalnyslygy---", e)
         );
   }
   const sumAddState = ctx.session.sumAddStates[adminId];
   if (!sumAddState) {
      return ctx
         .editMessageText(
            "Hasap goşmak eýýäm ýatyryldy ýa-da amala aşyryldy ýa-da ýalňyşlyk döredi!"
         )
         .catch((e) =>
            console.error(
               "---declineAdd editMessageText reply yalnyslygy---",
               e
            )
         );
   }
   delete ctx.session.sumAddStates[adminId];
   return await ctx
      .editMessageText("Hasap goşmak ýatyryldy.")
      .catch((e) =>
         console.error("---declineAdd editMessageText reply yalnyslygy---", e)
      );
});
bot.callbackQuery("declineCheck", async (ctx) => {
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
   const checkState = ctx.session.checkStates[adminId];
   if (!checkState) {
      return ctx
         .editMessageText(
            "Barlag eýýäm ýatyryldy ýa-da amala aşyryldy ýa-da ýalňyşlyk döredi!"
         )
         .catch((e) =>
            console.error(
               "---declineCheck duwmesinde editMessageText yalnyslygy---",
               e
            )
         );
   }
   delete ctx.session.checkStates[adminId];
   return await ctx
      .editMessageText("Barlag ýatyryldy.")
      .catch((e) =>
         console.error(
            "---declineCheck duwmesinde editMessageText yalnyslygy---",
            e
         )
      );
});

bot.on("message", async (ctx) => {
   const userId = ctx.chat.id;
   const reasonState = ctx.session.reasonStates[userId];
   const sumAddState = ctx.session.sumAddStates[userId];
   const chatState = ctx.session.chatStates[userId];
   const broadcastState = ctx.session.broadcastStates[userId];
   const checkState = ctx.session.checkStates[userId];
   if (reasonState) {
      const reason = ctx.message.text;
      const ordIdmess = ordrIdMssgFnc(reasonState.orderId);
      await bot.api
         .sendMessage(
            reasonState.client,
            `${ordIdmess}  ${ordrDclngMssgFnc(
               userId.toString(),
               false,
               reason,
               true
            )}`,
            {
               parse_mode: "HTML",
            }
         )
         .catch((e) =>
            console.error("---reasonState sendMessage yalnyslygy---", e)
         );
      for (let i = 0; i < adminidS.length; i++) {
         try {
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
         } catch (error) {
            console.error(
               "---reasonState for-editMessageText yalnyslygy---",
               error
            );
         }
      }
      ctx.deleteMessage().catch((e) =>
         console.error("---reasonState deleteMessage yalnyslygy---", e)
      );
      return delete ctx.session.reasonStates[userId];
   } else if (sumAddState) {
      // addSumm data collector
      // collect walletNumber
      if (sumAddState.walNum === "") {
         if (!ctx.message.text) {
            delete ctx.session.sumAddStates[userId];
            return ctx
               .reply("Hasap nomer girizilmedi. Başdan synanyşyň.")
               .catch((e) =>
                  console.error("---sumAddState reply yalnyslygy---", e)
               );
         }
         sumAddState.walNum = ctx.message.text;
         ctx.api
            .editMessageText(
               userId,
               sumAddState.mssgId,
               `Hasap nomer: ${sumAddState.walNum} \n Walýuta ?`,
               {
                  reply_markup: new InlineKeyboard()
                     .text("TMT", "choose_TMT")
                     .row()
                     .text("USDT", "choose_USDT")
                     .row()
                     .text("Goýbolsun " + statusIcons.care[7], "declineAdd"),
               }
            )
            .catch((e) =>
               console.error("---sumAddState editMessageText yalnyslygy---", e)
            );
         return await ctx
            .deleteMessage()
            .catch((e) =>
               console.error("---sumAddState deleteMessage yalnyslygy---", e)
            );
      } else if (sumAddState.sum === 0.0) {
         // collect sum
         const sum = ctx.message.text;
         if (!sum && isNaN(Number(sum))) {
            delete ctx.session.sumAddStates[userId];
            return ctx.reply("Girizen mukdaryňyz nädogry. Başdan synanyşyň.");
         }
         sumAddState.sum = Number(Number(sum).toFixed(2));
         ctx.deleteMessage().catch((e) =>
            console.error("---sumAddState deleteMessage yalnyslygy---", e)
         );
         return ctx.api
            .editMessageText(
               userId,
               sumAddState.mssgId,
               `Hasap nomer: ${sumAddState.walNum} \n ${sumAddState.sum} ${sumAddState.crrncy}`,
               {
                  reply_markup: new InlineKeyboard()
                     .text("Ýalňyş", "declineAdd")
                     .text("Dogry", "complateAdd"),
               }
            )
            .catch((e) =>
               console.error("---sumAddState editMessageText yalnyslygy---", e)
            );
      }
   } else if (chatState && chatState.calling && !chatState.userId) {
      const expectingID = ctx.message.text;
      if (!expectingID) {
         return ctx
            .reply("Id ugradyn")
            .catch((e) =>
               console.error("---chatState calling reply yalnyslygy---", e)
            );
      }
      chatState.calling = false;
      try {
         await ctx.api.sendMessage(
            expectingID,
            `Admin sizi söhbetdeşlige çagyrýar.`,
            {
               reply_markup: new InlineKeyboard().text(
                  "Kabul et",
                  "acceptChat_" + userId
               ),
            }
         );
         return ctx.reply(
            "Ýüzlenme ugradyldy, kabul edilenden soň habar beriler."
         );
      } catch (error: any) {
         delete ctx.session.chatStates[userId];
         console.error(`---chatState calling yalnyslygy---`, error);
         // Kullanıcı botu engellediyse veya başka bir hata varsa
         if (
            error.description &&
            error.description.includes("bot was blocked by the user")
         ) {
            return ctx.reply(
               `Ulanyjy boty petikläpdir ýa-da başga sebäpden habar ugradyp bolmady.\n` +
                  error.description
            );
         }
      }
   } else if (chatState && chatState.userId) {
      if (ctx.message && !ctx.message.pinned_message) {
         // If it is not a pinned message notification, copy the message
         await ctx.api
            .copyMessage(
               chatState.userId, // Chat ID for the message to be sent
               ctx.chat.id, // Chat ID from which the message came
               ctx.message.message_id // ID of the message to be copied
            )
            .catch((e) =>
               console.error("---chatState copyMessage yalnyslygy---", e)
            );
      }
   } else if (broadcastState) {
      const users = await prisma.user.findMany().catch((e) => {
         console.error("---broadcastState prisma yalnyslygy---", e);
         return [];
      });

      console.log(`Jemi ${users.length} ulanyja habar ugradylýar...`);

      for (const user of users) {
         try {
            await ctx.api.copyMessage(
               user.id, // Chat ID for the message to be sent
               userId, // Chat ID from which the message came
               ctx.message.message_id // ID of the message to be copied
            );
            console.log(`Habar ugradyldy: ${user.id}`);
            // Hız limiti için küçük bir bekleme ekleyebilirsiniz (örneğin 50-100 ms)
            await new Promise((resolve) => setTimeout(resolve, 100));
         } catch (error: any) {
            console.error(`Habar ugratma ýalňyşlygy ${user.id}:`, error);
            // Kullanıcı botu engellediyse veya başka bir hata varsa
            if (
               error.description &&
               error.description.includes("bot was blocked by the user")
            ) {
               console.log(`Ulanyjy boty petikläpdir, ${user.id}`);
            }
            // Diğer hatalar için farklı işlemler yapabilirsiniz.
         }
      }

      await ctx
         .reply(
            "Köpçülikleýin habar ibermek prosesi tamamlandy (nogsanlyklar bolup biler)."
         )
         .catch((e) =>
            console.error("---broadcastState reply yalnyslygy---", e)
         );
      delete ctx.session.broadcastStates[userId];
   } else if (checkState) {
      const message = ctx.message.text || "";
      ctx.deleteMessage().catch((e) =>
         console.error("---checkState deleteMessage yalnyslygy---", e)
      );
      let user;
      const fromId = await prisma.user
         .findUnique({
            where: { id: message },
         })
         .catch((e) => console.error("---checkState prisma yalnyslygy---", e));
      if (fromId) {
         user = fromId;
      } else {
         const formWal = await prisma.user
            .findUnique({
               where: { walNum: message },
            })
            .catch((e) =>
               console.error("---checkState prisma yalnyslygy---", e)
            );
         if (formWal) {
            user = formWal;
         }
      }
      if (!user) {
         delete ctx.session.checkStates[userId];
         return ctx.api
            .editMessageText(
               userId,
               checkState.messageId,
               "Hasap tapylmady, täzeden synanyşyň."
            )
            .catch((e) =>
               console.error("---checkState editMessageText yalnyslygy---", e)
            );
      }
      delete ctx.session.checkStates[userId];
      return ctx.api
         .editMessageText(
            userId,
            checkState.messageId,
            `ID: <a href="tg://user?id=${user.id}">${user.id}</a> \n Hasap nomer: <code>${user.walNum}</code> \n TMT: ${user.sumTmt} \n USDT: ${user.sumUsdt}`,
            {
               parse_mode: "HTML",
            }
         )
         .catch((e) =>
            console.error("---checkState editMessageText yalnyslygy---", e)
         );
   }
});

bot.start();
