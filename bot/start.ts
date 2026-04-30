import { InlineKeyboard } from "grammy";
import { type Message } from "@grammyjs/types";
import { prisma } from "./prisma/prismaSett";
import {
   adminidS,
   domain,
   editSummComand,
   pricingTiersFunc,
   productTitle,
   statusIcons,
} from "./src/settings";
import { bot, MyContext } from "./src/botConf";
import { PaymentMethod } from "./prisma/prismaSett";
import { err_6, err_7 } from "./src/errCodes";
import {
   adminValid,
   chatIdV,
   isAdminId,
   userValid,
   usrFnd,
   validator,
} from "./src/validators";
import {
   afterOrderConfirmedMess,
   blockText,
   hspMsg,
   ordrCmltdMssgFnc,
   ordrDclngMssgFnc,
   ordrDlvrng,
   ordrIdMssgFnc,
   prdctDtlMssg,
   sspcsCaseMs,
   userInfo,
   userLink,
   welcome,
} from "./src/messages";
import { cnclAddSumBtnn, dlvrOrdrKybrd, mainKEybiard } from "./src/keyboards";
import bcrypt from "bcrypt";

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
/* bot.hears("Lobi", async (ctx) => {
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
*/

// bot start command
bot.command("start", async (ctx) => {
   const userID = ctx.from?.id;
   // çreating user to do geting message permission
   const user = await userValid(userID, true);
   const param = ctx.match;
   if (param === "calladmin") {
      return ctx.reply("Balansyňyzy doldurmak üçin admini çagyryň.", {
         reply_markup: mainKEybiard(ctx.from?.id.toString() || ''),
      });
   }

   if ("error" in user) {
      return ctx.reply(user.mssg + " \n Täzeden synanşyň /start").catch((e) => {
         console.error("---start komandynda reply yalnyslygy---", e);
      });
   }

   ctx.reply(welcome, {
      reply_markup: mainKEybiard(ctx.from?.id.toString() || ''),
      parse_mode: "HTML",
   }).catch((e) => {
      console.error("---start komandynda reply yalnyslygy---", e);
   });
});
// sending bulk messages
bot.command("signup", async (ctx) => {
   const isAmdin = isAdminId(ctx.from?.id);
   if (isAmdin.error) {
      return ctx.deleteMessage();
   }

   if (ctx.from?.id !== undefined) {
      try {
         const message = await ctx.reply("Nickname \n Parol");
         ctx.session.signupState[ctx.from.id] = {
            nick: undefined,
            pass: undefined,
            message_id: message.message_id,
         };
      } catch (error) {
         console.error("---brodcast komandada reply yalnyslygy---", error);
      }
   }
});
bot.command("broadcast", async (ctx) => {
   const isAmdin = isAdminId(ctx.from?.id);
   if (isAmdin.error) {
      return ctx.deleteMessage().catch((e) => {
         console.error("---brodcast komandada deleteMessage yalnyslygy---", e);
      });
   }

   if (ctx.from?.id !== undefined) {
      try {
         const message = await ctx.reply("Texti ugradyn", {
            reply_markup: new InlineKeyboard().text(
               "Ýatyr",
               "cancelBroad_" + ctx.from.id,
            ),
         });
         ctx.session.broadcastStates[ctx.from.id] = {
            message: "",
            message_id: message.message_id,
         };
      } catch (error) {
         console.error("---brodcast komandada reply yalnyslygy---", error);
      }
   }
});
bot.command("redeem", async (ctx) => {
   const isAdmin = adminValid(ctx.from?.id);
   if (isAdmin.error) {
      return ctx.deleteMessage();
   }

   if (ctx.from?.id !== undefined) {
      try {
         const message = await ctx.reply("Redeem kodlaryny ugradyn");
         ctx.session.redeemCodeState[ctx.from.id] = {
            messageId: message.message_id,
         };
      } catch (error) {
         console.error("---redeem komandada reply yalnyslygy---", error);
      }
   }
});
bot.command("stop", async (ctx) => {
   const userID = ctx.from?.id || 0;
   const isAdmin = isAdminId(userID);
   const chatState = ctx.session.chatStates[userID];
   if (!userID || !chatState) {
      return ctx.deleteMessage();
   }

   const replyMsg = await ctx.reply(`Söhbetdeşlik tamamlandy.`);
   let userCtx: Message = replyMsg;

   if (chatState.userId !== 0) {
      const adminMsg = await ctx.api.sendMessage(
         chatState.userId,
         `<blockquote>bot</blockquote> Söhbetdeşlik tamamlandy.`,
         { parse_mode: "HTML" },
      );
      if (!isAdmin.error) userCtx = adminMsg;
   }

   const user = await userValid(userCtx.chat.id);
   if ("error" in user) {
      return ctx.reply(user.mssg);
   }
   const userInfoText = await userInfo({
      user: {
         ...user,
         username: userCtx.chat.username,
         fullname:
            userCtx.chat.first_name +
            (userCtx.chat.last_name ? ` ${userCtx.chat.last_name}` : ""),
      },
   });
   if (chatState.messageIds.length > 0) {
      for (let i = 0; i < adminidS.length; i++) {
         const messageToSend = `${blockText(userInfoText, true)} ${isAdmin.error ? userLink({ id: chatState.userId }) : userLink({ id: userID, nick: ctx.from?.first_name })}: söhbetdeşlik tamamlady`;
         try {
            await ctx.api.editMessageText(
               adminidS[i],
               chatState?.messageIds[i],
               messageToSend,
               { parse_mode: "HTML" },
            );

            if (userID.toString() === adminidS[i]) {
               ctx.unpinChatMessage(chatState?.messageIds[i]);
            } else if (chatState.userId.toString() === adminidS[i]) {
               ctx.api.unpinChatMessage(adminidS[i], chatState?.messageIds[i]);
            }
         } catch (e) {
            console.error(
               "---stop komandasynda fot-editMessageText yalnyslygy---",
               e,
            );
         }
      }
   }

   delete ctx.session.chatStates[userID];
   delete ctx.session.chatStates[chatState.userId];
});
bot.command("clear", async (ctx) => {
   const userId = ctx.chat.id;
   const transferState = ctx.session.transferStates[userId];
   const signupState = ctx.session.signupState[userId];
   const sumAddState = ctx.session.sumAddStates[userId];
   const chatState = ctx.session.chatStates[userId];
   const broadcastState = ctx.session.broadcastStates[userId];
   const checkState = ctx.session.checkStates[userId];
   const redeemCodeState = ctx.session.redeemCodeState[userId];
   const reasonState = ctx.session.reasonStates[userId];

   if (transferState) {
      delete ctx.session.transferStates[userId];
   }
   if (signupState) {
      delete ctx.session.signupState[userId];
   }
   if (sumAddState) {
      delete ctx.session.sumAddStates[userId];
   }
   if (chatState) {
      await ctx.api.sendMessage(chatState.userId, "Söhbetdeşlik tamamlandy.");
      delete ctx.session.chatStates[userId];
      delete ctx.session.chatStates[chatState.userId];
   }
   if (broadcastState) {
      delete ctx.session.broadcastStates[userId];
   }
   if (checkState) {
      delete ctx.session.checkStates[userId];
   }
   if (redeemCodeState) {
      delete ctx.session.redeemCodeState[userId];
   }
   if (reasonState) {
      delete ctx.session.reasonStates[userId];
   }
   return ctx.reply("Ähli açyk ýagdaýlar aradan aýryldy. Täzeden synanyşyň!");
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
      .catch((e: any) => {
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
      .catch((e: Error) => {
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
bot.command("block", async (ctx) => {
   // 1. Check if the user is an admin
   const adminId = ctx.from?.id;
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      return ctx.reply("Bu komandy diňe adminler ulanyp bilýär!");
   }

   // 2. Get the user ID to block from the command arguments
   const targetUserId = ctx.match;
   if (!targetUserId) {
      return ctx.reply(
         "Bloklamak üçin ulanyjy ID-sini ýazyň. Meselem: /block 123456",
      );
   }

   // 3. Find the user in the database
   const userToBlock = await prisma.user.findUnique({
      where: { id: targetUserId },
   });

   if (!userToBlock) {
      return ctx.reply("Ulanyjy tapylmady.");
   }

   // 4. Check if we are trying to block an admin
   const isTargetAdmin = adminValid(parseInt(targetUserId, 10));
   if (!isTargetAdmin.error) {
      return ctx.reply("Admini bloklap bolmaýar.");
   }

   // 5. Update the user's `blocked` status
   await prisma.user.update({
      where: { id: targetUserId },
      data: { blocked: true },
   });

   // 6. Notify the admin
   await ctx.reply(`Ulanyjy ${targetUserId} bloklandy.`);

   // 7. Notify the user (optional, but good practice)
   try {
      await ctx.api.sendMessage(
         targetUserId,
         "Siz admin tarapyndan bloklandyňyz.",
      );
   } catch (error) {
      console.error("Could not notify user about block:", error);
      await ctx.reply(
         "Ulanyja bildiriş ugradyp bolmady (belki, boty bloklan bolmagy mümkin).",
      );
   }
});
bot.command("unblock", async (ctx) => {
   // 1. Check if the user is an admin
   const adminId = ctx.from?.id;
   const isAdmin = adminValid(adminId);
   if (isAdmin.error) {
      return ctx.reply("Bu komandy diňe adminler ulanyp bilýär!");
   }

   // 2. Get the user ID to unblock from the command arguments
   const targetUserId = ctx.match;
   if (!targetUserId) {
      return ctx.reply(
         "Blokdan çykarmak üçin ulanyjy ID-sini ýazyň. Meselem: /unblock 123456",
      );
   }

   // 3. Find the user in the database
   const userToUnblock = await prisma.user.findUnique({
      where: { id: targetUserId },
   });

   if (!userToUnblock) {
      return ctx.reply("Ulanyjy tapylmady.");
   }

   // 4. Update the user's `blocked` status
   await prisma.user.update({
      where: { id: targetUserId },
      data: { blocked: false },
   });

   // 5. Notify the admin
   await ctx.reply(`Ulanyjy ${targetUserId} blokdan çykaryldy.`);

   // 6. Notify the user
   try {
      await ctx.api.sendMessage(
         targetUserId,
         "Siz admin tarapyndan blokdan çykaryldyňyz.",
      );
   } catch (error) {
      console.error("Could not notify user about unblock:", error);
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
bot.command("0804", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return;
   }
   if (ctx.session.transferStates[userID]) {
      return ctx
         .reply("Birinji öňki geçirimi tamamlaň, soňra täzeden synanyşyň!")
         .catch((e) =>
            console.error("---reply komandynda deleteMessage yalnyslygy---", e),
         );
   }

   // asking walnum
   const message = await ctx
      .reply(`Kabul edijiniň balans ID-si?`, {
         reply_markup: new InlineKeyboard().text(
            "Ýatyr " + statusIcons.care[7],
            "declineTransfer",
         ),
      })
      .catch((e) =>
         console.error("---transfer komandynda reply yalnyslygy---", e),
      );

   // open the state
   ctx.session.transferStates[userID] = {
      messageId: message?.message_id || 0,
      recieverID: 0,
      senderWalNum: "",
      recieverWalNum: "",
      amount: 0,
      currency: "",
   };

   if (ctx.session.transferStates[userID].messageId) {
      ctx.pinChatMessage(ctx.session.transferStates[userID].messageId).catch(
         (e) =>
            console.error(
               "---transfer komandynda pinChatMessage yalnyslygy---",
               e,
            ),
      );
      return;
   }
   delete ctx.session.transferStates[userID];
   return ctx
      .reply("Ýalňyşlyk ýüze çykdy täzeden synanyşyň.")
      .catch((e) =>
         console.error("---transfer komandynda reply yalnyslygy---", e),
      );
});

bot.hears("-Hasap-", async (ctx) => {
   const userID = ctx.from?.id;
   const isAdmin = adminValid(userID);
   if (ctx.session.sumAddStates[userID || 0]) {
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error(
               "---editSummComand komandynda deleteMessage yalnyslygy---",
               e,
            ),
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
                  ctx.from?.id,
               ),
            );
         } catch (error) {
            console.error(
               "---editSummComand komandasynda map-sendMessage yalnyslygy---",
               error,
            );
         }
      });
      return ctx
         .reply(isAdmin.mssg)
         .catch((e) =>
            console.error(
               "---editSummComand komandynda reply yalnyslygy---",
               e,
            ),
         );
   }
   // asking walnum
   const message = await ctx
      .reply(`Balans ID ýa-da Telegram ID: ?`, {
         reply_markup: cnclAddSumBtnn(),
      })
      .catch((e) =>
         console.error("---editSummComand komandynda reply yalnyslygy---", e),
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
bot.hears("-Barla-", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error("---check komandynda deleteMessage yalnyslygy---", e),
         );
   }
   if (ctx.session.checkStates[userID]) {
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error("---check komandynda deleteMessage yalnyslygy---", e),
         );
   }
   /* if (ctx.session.chatStates[Number(userID)]) {
      return ctx
         .reply(
            "Siz şu wagt söhbetdeşlikde, ilki söhbetdeşligi tamamlaň! \n /stop"
         )
         .catch((e) =>
            console.error("---check komandynda reply yalnyslygy---", e)
         );
   } */
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
               ctx.from?.id,
            ),
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
         console.error("---check komandynda reply yalnyslygy---", e),
      );
   // open the state
   ctx.session.checkStates[userID] = {
      messageId: message?.message_id || 0,
   };
   return;
});
bot.hears("-Çagyr-", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return;
   }
   if (ctx.session.chatStates[userID]) {
      return await ctx
         .reply(
            "Siz häzir hem söhbetdeşlikde. Öňki söhbetdeşligi ýapmak üçin 👉 /stop 👈",
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
bot.hears("Dükana gir 🛒", async (ctx) => {
   ctx.reply("Dükana girmek üçin aşaky düwma basyň.", {
      reply_markup: new InlineKeyboard().webApp("Söwda 🛒", domain),
   }).catch((e) => {
      console.error("---Dükana gir dinleyjisinde reply yalnyslygy---", e);
   });
});
// hasap command
bot.hears("Balans", async (ctx) => {
   const userID = ctx.from?.id;
   console.log("balans barlady: ", userID);
   // geting user
   const user = await userValid(userID);
   if ("error" in user) {
      return ctx
         .reply(
            user.mssg + " \n Täzeden synanşyň ýa-da /start berip boty başladyň",
         )
         .catch((e) => {
            console.error("---Balansy barla dinleyjide reply yalnyslygy---", e);
         });
   }
   return ctx
      .reply(hspMsg(user.walNum, user.sumTmt, user.sumUsdt), {
         reply_markup: new InlineKeyboard().copyText(user.walNum, user.walNum),

         parse_mode: "HTML",
      })
      .catch((e) => {
         console.error("---Balansy barla dinleyjide reply yalnyslygy---", e);
      });
});
// calling an admin
bot.hears("Admini çagyr", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return;
   }
   const user = await userValid(userID);
   if ("error" in user) {
      return ctx.reply(user.mssg);
   }

   if (user.blocked) {
      return ctx.reply(
         "Siz admin tarapyndan bloklanan, 'Admini çagyr' funksiýasyny ulanyp bilmersiňiz.",
      );
   }
   if (isAdminId(userID).error === false) {
      return await ctx.reply("Admin admini çagyryp bilmeýär!").catch((e) => {
         console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
      });
   }
   if (ctx.session.transferStates[userID]) {
      return await ctx
         .reply(
            "Geçirimi açyk wagty admin çagyryp bolmaýar. Geçirimiňizi tamamlap ýa-da ýatyryp admini gaýtadan çagyryň. Eger başa barmasa /clear 👈 buýruguny ulanyň!",
            {
               reply_to_message_id:
                  ctx.session.transferStates[userID].messageId,
            },
         )
         .catch((e) => {
            console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
         });
   }
   if (ctx.session.chatStates[userID]) {
      return await ctx
         .reply(
            "Siz häzir hem admin bilen söhbetdeşlikde. Öňki söhbetdeşligi ýapmak üçin 👉 /stop 👈",
         )
         .catch((e) => {
            console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
         });
   }

   const fullname = ctx.from?.first_name + " " + (ctx.from?.last_name || "");
   const userInfoText = await userInfo({
      user: { ...user, fullname: fullname, username: ctx.from?.username || "" },
   });
   const messageIds: number[] = [];
   for (const adminId of adminidS) {
      try {
         const { message_id } = await ctx.api.sendMessage(
            adminId,
            `${blockText(userInfoText, true)} Söhbetdeşlige garaşylýar.`,
            {
               reply_markup: new InlineKeyboard().text(
                  "Tassykla",
                  "acceptChat_" + userID,
               ),
               parse_mode: "HTML",
            },
         );

         messageIds.push(message_id);
      } catch (e) {
         console.error(
            "---Admini çagyr duwmesinde for-sendMessage yalnyslygy---",
            e,
         );
      }
   }
   ctx.session.chatStates[userID] = {
      userId: 0,
      username: ctx.from?.username,
      messageIds: messageIds,
   };
   ctx.reply(
      "Admin söhbetdeşligi kabul etýänçä garaşyň. Size habar beriler.",
   ).catch((e) => {
      console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
   });
});
bot.callbackQuery(/acceptChat_(.+)/, async (ctx) => {
   const acceptorId = ctx.from.id;
   const userID = parseInt(ctx.match[1]);
   const chatState = ctx.session.chatStates[userID];

   if (!chatState || !userID || !acceptorId) {
      return await ctx.reply("Yalnyslyk");
   }
   if (ctx.session.chatStates[acceptorId]) {
      return await ctx
         .answerCallbackQuery({
            text: "Siz öňem sohbetdeşlikde, ilki öňki söhbetdeşligi tamamlaň! \n /stop",
            show_alert: true,
         })
         .catch((e) => {
            console.error(
               "---acceptChat duwmesinde answerCallbackQuery yalnyslygy---",
               e,
            );
         });
   }
   if (ctx.session.chatStates[userID].userId !== 0) {
      return await ctx.editMessageText(
         "Admin häzir başga söhbetdeşlikde, admini özüňiz çagyryň.",
      );
   }
   chatState.userId = acceptorId;
   ctx.session.chatStates[acceptorId] = {
      userId: userID,
      messageIds: chatState.messageIds,
   };
   const user = await userValid(userID);
   if ("error" in user) {
      return ctx.reply("Ulanyjy tapylmady.");
   }
   const userCtx = await ctx.api.sendMessage(
      userID,
      "Söhbetdeşlik kabul edildi. Mundan beýläk söhbetdeşlik ýapylýança, ugradan zatlaryňyz garşy tarapa barar.",
   );
   const userInfoText = await userInfo({
      user: {
         ...user,
         username: userCtx.chat?.username || "",
         fullname:
            userCtx.chat.first_name + " " + (userCtx.chat.last_name || ""),
      },
   });
   if (chatState.messageIds.length > 0) {
      for (let i = 0; i < adminidS.length; i++) {
         try {
            await ctx.api.editMessageText(
               adminidS[i],
               chatState?.messageIds[i],
               `${blockText(userInfoText, true)} ${acceptorId.toString() === adminidS[i] ? "Siz" : userLink({ id: acceptorId, nick: ctx.from?.first_name })} söhbetdeşlikde.`,
               {
                  parse_mode: "HTML",
                  reply_markup:
                     adminidS[i] === acceptorId.toString()
                        ? new InlineKeyboard().copyText(
                             userID.toString(),
                             userID.toString(),
                          )
                        : undefined,
               },
            );
            if (acceptorId.toString() === adminidS[i]) {
               ctx.pinChatMessage(chatState?.messageIds[i]);
            }
         } catch (e) {
            console.error(
               "---acceptChat duwmesinde fot-editMessageText yalnyslygy---",
               e,
            );
         }
      }
   } else {
      ctx.editMessageText(
         "Söhbetdeşlik kabul edildi. Mundan beýläk söhbetdeşlik ýapylýança, ugradan zatlaryňyz garşy tarapa barar.",
      );
   }
});
// cancel sending bulk messages
bot.callbackQuery(/cancelBroad_(.+)/, async (ctx) => {
   delete ctx.session.broadcastStates[ctx.from.id];
   ctx.answerCallbackQuery({ text: "Yatyryldy", show_alert: true }).catch(
      (e) => {
         console.error(
            "---cancelBroad duwmesinde answerCallbackQuery yalnyslygy---",
            e,
         );
      },
   );
});
// Bu kodu bot.callbackQuery bloklarının dışında, ana bot dosyanın uygun bir yerine ekle
bot.on("pre_checkout_query", async (ctx) => {
   try {
      await ctx.answerPreCheckoutQuery(true);
   } catch (error) {
      console.error("pre_checkout_query hatası:", error);
   }
});

bot.on("message:successful_payment", async (ctx) => {
   const paymentInfo = ctx.message.successful_payment;
   // Payload'dan Sipariş ID'si ve Mesaj ID'sini ayırıyoruz (Örn: "145_5932")
   const payloadParts = paymentInfo.invoice_payload.split("_");
   const orderId = parseInt(payloadParts[0], 10);
   const originalMsgId = parseInt(payloadParts[1], 10);

   const totalAmount = paymentInfo.total_amount;
   const currency = paymentInfo.currency; // XTR

   console.log(
      `Ödeme başarılı! Sipariş ID: ${orderId}, Tutar: ${totalAmount} ${currency}`,
   );

   if (isNaN(orderId)) {
      console.error("Geçersiz sipariş ID'si döndü!");
      return await ctx.reply("Sargyt ID tapylmady. Adminler bilen habarlaşyň.");
   }

   const order = await validator(orderId, ["accepted", "pending"], "paid");
   if ("error" in order) {
      console.error(
         "Ödeme başarılı ama sipariş güncellenirken hata oluştu:",
         order.mssg,
      );
      return await ctx.reply(
         "Töleg üstünlikli geçdi, emma sargyt ulgamynda säwlik döredi. Adminler bilen habarlaşyň.",
      );
   }

   // İşte bu ID iade işlemi için hayati önem taşıyor:
   const chargeId = paymentInfo.telegram_payment_charge_id;
   await prisma.starTransaction
      .update({
         where: { orderId: order.id },
         data: { chargeId: chargeId },
      })
      .catch((e) => {
         console.error("StarTransaction güncellenirken hata:", e);
      });

   // 1. ADMINLERE MESAJ GÖNDERME İŞLEMİ
   const ordIdMssg = ordrIdMssgFnc(order.id);
   const mssgIds: number[] = [];

   for (const adminid of adminidS) {
      try {
         const data = await ctx.api.sendMessage(
            adminid,
            `${ordIdMssg} ${prdctDtlMssg({ order: order, forWhom: "admin" })}`,
            { reply_markup: dlvrOrdrKybrd(order), parse_mode: "HTML" },
         );
         mssgIds.push(data.message_id);
      } catch (e) {
         console.error("---successful_payment admin sendMessage hatası---", e);
      }
   }

   // 2. KULLANICI MESAJINI GÜNCELLEME İŞLEMİ
   let adminOnlineStatus = true; // Sisteminize göre ayarlayın
   const clntmssg = afterOrderConfirmedMess({
      order: order,
      adminOnlineStatus,
   });

   // Tıpkı normal ödemelerdeki gibi metni hazırlıyoruz
   const finalMessageText = `${ordIdMssg} <blockquote expandable>${prdctDtlMssg(
      {
         order: order,
         forWhom: "client",
      },
   )}</blockquote> \n ${clntmssg}\n`;

   try {
      // Yeni mesaj yollamak yerine, faturayı oluşturduğumuz o eski mesajı düzenliyoruz:
      await ctx.api.editMessageText(
         ctx.chat.id,
         originalMsgId,
         finalMessageText,
         {
            parse_mode: "HTML",
            // "Öde" butonunu kaldırıp, gerekirse "İptal" butonunu bırakıyoruz
            reply_markup:
               (order.Product.chatRequired === false && !adminOnlineStatus) ||
               adminOnlineStatus
                  ? undefined
                  : new InlineKeyboard().text(
                       "Ýatyr " + statusIcons.no[2],
                       "cancelOrder_" + order.id,
                    ),
         },
      );
   } catch (error) {
      console.error("Eski müşteri mesajı güncellenirken hata oluştu:", error);
      // Eğer bir nedenden ötürü mesaj düzenlenemezse (örn. mesaj çok eskiyse), yedek olarak yeni mesaj at:
      await ctx.reply(finalMessageText, { parse_mode: "HTML" });
   }

   // Session kayıt işlemleri
   ctx.session.ordrMsgEdtStts[orderId] = {
      mssgIds: mssgIds,
      clntMssgId: originalMsgId,
   };
});
// if order accept by the client
bot.callbackQuery(/acceptOrder_(.+)/, async (ctx) => {
   const orderId = parseInt(ctx.match[1]);
   const clntID = ctx.from.id;

   const chatId = chatIdV(clntID);
   if (chatId.error) {
      return await ctx.answerCallbackQuery({
         text: chatId.mssg,
         show_alert: true,
      });
   }

   const order = await validator(orderId, ["pending"], "accepted");
   if ("error" in order) {
      return await ctx.answerCallbackQuery({
         text: order.mssg,
         show_alert: true,
      });
   }

   if (order.userId !== clntID.toString()) {
      return await ctx.answerCallbackQuery({
         text: "Sargydyň eyesi siz däl",
         show_alert: true,
      });
   }

   if (order.quantity) {
      const { tmtPrice, usdtPrice, amount } = pricingTiersFunc({
         product: order.Product,
         quantity: order.quantity,
      });
      order.Product.priceTMT = tmtPrice;
      order.Product.priceUSDT = usdtPrice;
      order.Product.amount = amount;
   }

   // YILDIZ ÖDEMESİ MANTIĞI: Linki oluştur ve BURADA DUR (Return).
   if (order.payment === "STAR" && order.StarTransaction) {
      try {
         // Fatura payload'ına hem Sipariş ID'sini hem de şu anki Mesaj ID'sini ekliyoruz:
         const payloadData = `${order.id}_${ctx.msg?.message_id}`;

         const invoiceLink = await ctx.api.createInvoiceLink(
            productTitle(order.Product.name),
            order.Product.title ||
               order.Product.duration ||
               order.Product.amount?.toString() ||
               "Sargyt",
            payloadData, // <-- DEĞİŞİKLİK BURADA: SiparişID_MesajID gönderiyoruz
            "",
            "XTR",
            [{ label: "Bahasy", amount: Number(order.StarTransaction.price) }],
         );

         const payKeyboard = new InlineKeyboard()
            .url("Töleg et", invoiceLink)
            .style("primary")
            .icon("4983748881977181112");

         await ctx.editMessageReplyMarkup({ reply_markup: payKeyboard });
         await ctx.answerCallbackQuery({
            text: "Tölegi geçirip bilersiňiz.",
         });

         return;
      } catch (error) {
         console.error("Fatura linki oluşturulurken hata:", error);
         return await ctx.answerCallbackQuery({
            text: "Töleg ulgamynda säwlik döredi.",
            show_alert: true,
         });
      }
   }

   // --- EĞER ÖDEME YILDIZ (STAR) DEĞİLSE ---
   // (Örneğin nakit veya havale ise, direkt adminlere haber ver ve işlemi bitir)

   const ordIdMssg = ordrIdMssgFnc(order.id);
   try {
      const mssgIds: number[] = [];
      for (const adminid of adminidS) {
         try {
            const data = await ctx.api.sendMessage(
               adminid,
               `${ordIdMssg} ${prdctDtlMssg({ order: order, forWhom: "admin" })}`,
               { reply_markup: dlvrOrdrKybrd(order), parse_mode: "HTML" },
            );
            mssgIds.push(data.message_id);
         } catch (e) {
            console.error("---acceptOrder admin mesaj hatası---", e);
         }
      }

      let adminOnlineStatus = true;
      const clntmssg = afterOrderConfirmedMess({
         order: order,
         adminOnlineStatus,
      });

      const sentMessageToClient = await ctx.editMessageText(
         `${ordIdMssg} <blockquote expandable>${prdctDtlMssg({
            order: order,
            forWhom: "client",
         })}</blockquote> \n ${clntmssg}`,
         {
            parse_mode: "HTML",
            reply_markup:
               (order.Product.chatRequired === false && !adminOnlineStatus) ||
               adminOnlineStatus
                  ? undefined
                  : new InlineKeyboard().text(
                       "Ýatyr " + statusIcons.no[2],
                       "cancelOrder_" + order.id,
                    ),
         },
      );

      if (sentMessageToClient !== true) {
         ctx.session.ordrMsgEdtStts[orderId] = {
            mssgIds: mssgIds,
            clntMssgId: sentMessageToClient.message_id,
         };
      }
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
               e,
            ),
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
               e,
            ),
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
               e,
            ),
         );
   }
   // user sum update
   const data =
      order.payment === "TMT"
         ? {
              sumTmt:
                 order.User.sumTmt +
                 (order.total ? order.total : order.Product.priceTMT),
           }
         : order.payment === "USDT"
           ? {
                sumUsdt:
                   order.User.sumUsdt +
                   (order.total ? order.total : order.Product.priceUSDT),
             }
           : {};
   const userData = await prisma.user
      .update({
         where: {
            id: order.User.id,
         },
         data,
      })
      .catch((e) =>
         console.error("---cancelOrder duwmesinde prisma yalnyslygy---", e),
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
               e,
            ),
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
               e,
            ),
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
               e,
            ),
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
               e,
            ),
         );
   }

   // update and check order
   const order = await validator(
      orderId,
      ["accepted", "paid"],
      "delivering",
      adminId.toString(),
   );
   if ("error" in order) {
      return await ctx
         .answerCallbackQuery({
            text: order.mssg,
            show_alert: true,
         })
         .catch((e) =>
            console.error(
               "---deliverOrder duwmesinde answerCallbackQuery yalnyslygy---",
               e,
            ),
         );
   }
   // if it is ton paid order then message ids comes from database
   if (order.mssgIds.length > 0) {
      ctx.session.ordrMsgEdtStts[order.id] = {
         mssgIds: order.mssgIds,
         clntMssgId: order.clntMssgId || 0,
      };
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
               e,
            ),
         );
   }

   try {
      const keyboard = new InlineKeyboard()
         .text("Ýatyr" + statusIcons.no[2], "declineOrder_" + order.id)
         .text("Tabşyr" + statusIcons.yes[2], "orderDelivered_" + order.id)
         .row()
         .copyText(order.receiver, order.receiver);
      for (let i = 0; i < adminidS.length; i++) {
         try {
            await ctx.api.editMessageText(
               adminidS[i],
               ordrMsgIds?.mssgIds[i],
               `${ordrIdMssgFnc(
                  order.id,
               )} <blockquote expandable>${prdctDtlMssg({
                  order: order,
                  forWhom: "admin",
               })}</blockquote> \n ${ordrDlvrng(adminId, ctx.from.first_name)}`,
               {
                  reply_markup:
                     order.courierid === adminidS[i] ? keyboard : undefined,
                  parse_mode: "HTML",
               },
            );
            if (order.courierid === adminidS[i]) {
               ctx.pinChatMessage(ordrMsgIds?.mssgIds[i]);
            }
         } catch (e) {
            console.error(
               "---deliverOrder duwmesinde for-editMessageText yalnyslygy---",
               e,
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
               e,
            ),
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
               e,
            ),
         );
   }

   // order validator
   const order = await validator(
      orderId,
      ["accepted", "delivering", "paid"],
      "cancelled",
      adminId.toString(),
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
               e,
            ),
         );
      return ctx
         .deleteMessage()
         .catch((e) =>
            console.error(
               "---declineOrder duwmesinde deleteMessage yalnyslygy---",
               e,
            ),
         );
   }
   if (order.mssgIds.length > 0) {
      ctx.session.ordrMsgEdtStts[order.id] = {
         mssgIds: order.mssgIds,
         clntMssgId: order.clntMssgId || 0,
      };
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
               e,
            ),
         );
   }

   // --- USER SUM UPDATE & REFUND MANTIĞI ---
   if (order.payment === "STAR") {
      // 1. EĞER ÖDEME YILDIZ İLE YAPILDIYSA TELEGRAM ÜZERİNDEN İADE ET
      try {
         // Veritabanında (Prisma) kaydettiğin charge id'yi buraya çekmelisin.
         if (order.StarTransaction?.chargeId) {
            await ctx.api.refundStarPayment(
               Number(order.userId), // Kullanıcının Telegram ID'si (Sayı olmalı)
               order.StarTransaction?.chargeId, // Başarılı ödemede aldığımız işlem ID'si
            );
            console.log(
               `Sipariş ${order.id} için Yıldız iadesi başarıyla yapıldı.`,
            );
         } else {
            console.error(
               "Ýyldyzy gaýtaryp bermedi: telegramChargeId tapylmady!",
            );
            // İstersen burada admine "İade yapılamadı" diye bir alert gösterebilirsin
            return await ctx.answerCallbackQuery({
               text: "Ýyldyzy gaýtaryp bermedi: telegramChargeId tapylmady!",
               show_alert: true,
            });
         }
      } catch (refundError) {
         console.error(
            "Yıldız iadesi sırasında Telegram API hatası:",
            refundError,
         );
         return await ctx.answerCallbackQuery({
            text: "Ýyldyz gaýtarmak prosesinde Telegram API ýalňyşlygy!",
            show_alert: true,
         });
      }
   } else {
      // 2. EĞER NORMAL (TMT/USDT) ÖDEME İSE KULLANICI BAKİYESİNE GERİ YÜKLE
      const data =
         order.payment === "TMT"
            ? {
                 sumTmt:
                    order.User.sumTmt +
                    (order.total ? order.total : order.Product.priceTMT),
              }
            : {
                 sumUsdt:
                    order.User.sumUsdt +
                    (order.total ? order.total : order.Product.priceUSDT),
              };

      const userData = await prisma.user
         .update({
            where: { id: order.User.id },
            data,
         })
         .catch((e) =>
            console.error("---declineOrder duwmesinde prisma yalnyslygy---", e),
         );

      if (!userData) {
         console.log(err_6.d);
         return await ctx
            .answerCallbackQuery({ text: err_6.m, show_alert: true })
            .catch((e) =>
               console.error(
                  "---declineOrder duwmesinde answerCallbackQuery yalnyslygy---",
                  e,
               ),
            );
      }
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
               },
            );
            if (adminidS[i] === order.courierid) {
               ctx.unpinChatMessage(ordrMsgIds?.mssgIds[i]);
            }
         } catch (error) {
            console.error(
               "---declineOrder duwmesinde for-editMessageText yalnyslygy---",
               error,
            );
         }
      }

      const clntMssgId = ctx.session.ordrMsgEdtStts[orderId].clntMssgId;
      const clientMessage = `${ordrIdMssgFnc(
         order.id,
      )} <blockquote expandable>${prdctDtlMssg({
         order: order,
         forWhom: "client",
      })}</blockquote> \n ${statusIcons.no[2]} Ýatyryldy.`;

      await ctx.api.editMessageText(order.userId, clntMssgId, clientMessage, {
         parse_mode: "HTML",
      });

      // yatyrma sebabi garasylyar
      ctx.session.reasonStates[adminId] = {
         orderId: order.id,
         client: order.userId,
         mssgIds: ordrMsgIds.mssgIds,
         clntMssgId: clntMssgId,
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
               e,
            ),
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
      adminId.toString(),
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
               e,
            ),
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
               e,
            ),
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
               },
            );
            if (order.courierid === adminidS[i]) {
               ctx.unpinChatMessage(messageIds?.mssgIds[i]);
            }
         } catch (e) {
            console.error(
               "---orderDelivered duwmesinde for-editMessageText yalnyslygy---",
               e,
            );
         }
      }

      const clntMssgId = ctx.session.ordrMsgEdtStts[orderId].clntMssgId;
      await bot.api
         .sendMessage(
            order.userId,
            `${statusIcons.wait[0]} Sargydyňyz tabşyryldy`,
            {
               parse_mode: "HTML",
               reply_to_message_id: clntMssgId,
            },
         )
         .catch((e) =>
            console.error(
               "---orderDelivered duwmesinde sendMessage yalnyslygy---",
               e,
            ),
         );
      const clientMessage = `${ordrIdMssgFnc(
         order.id,
      )} <blockquote expandable>${prdctDtlMssg({
         order: order,
         forWhom: "client",
      })}</blockquote> \n ${statusIcons.yes[2]} Tabşyryldy.`;

      await ctx.api.editMessageText(order.userId, clntMssgId, clientMessage, {
         parse_mode: "HTML",
      });
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
               e,
            ),
         );
   }
});
// add sum crrcncy chooser
bot.callbackQuery(/^choose_(\w+)$/, async (ctx) => {
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
                  ctx.from?.id,
               ),
            );
         } catch (error) {
            console.error(
               "---choose duwmesinde map-sendMessage yalnyslygy---",
               error,
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
   try {
      return await ctx.editMessageText(
         /* adminId,
         sumAddState?.mssgId || 0, */
         `Hasap nomer: ${sumAddState?.walNum} \n Näçe ? ${sumAddState?.crrncy}`,
         {
            reply_markup: cnclAddSumBtnn(),
         },
      );
   } catch (e) {
      return console.error(
         "---editSummComand komandynda editMessageText yalnyslygy---",
         e,
      );
   }
});
bot.callbackQuery(/^select_(\w+)$/, async (ctx) => {
   const userID = ctx.from?.id;
   const transferState = ctx.session.transferStates[userID];

   // set çurrençy
   if (transferState) {
      transferState.currency = ctx.match[1] as PaymentMethod;
   }
   // next message
   try {
      return await ctx.editMessageText(
         /* adminId,
         sumAddState?.mssgId || 0, */
         `Balans ID: ${transferState?.recieverWalNum} \n Näçe ? ${transferState?.currency}`,
         {
            reply_markup: new InlineKeyboard().text(
               "Ýatyr " + statusIcons.care[7],
               "declineTransfer",
            ),
         },
      );
   } catch (e) {
      return console.error(
         "---editSummComand komandynda editMessageText yalnyslygy---",
         e,
      );
   }
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
                  ctx.from?.id,
               ),
            );
         });
      } catch (error) {
         console.error(
            "---complateAdd duwmesinde map-sendMessage yalnyslygy---",
            error,
         );
      }
      return ctx
         .reply(isAdmin.mssg)
         .catch((e) =>
            console.error("---complateAdd duwmesinde reply yalnyslygy---", e),
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
               editSummComand,
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
   // validating if sum is correct
   const fltdSum = sumAddState?.sum;
   if (fltdSum === undefined || isNaN(fltdSum) || fltdSum === 0) {
      delete ctx.session.sumAddStates[adminId];
      return ctx
         .editMessageText(
            "Yalnys pul mukdary dogry yazylmady, tazeden synansyn /" +
               editSummComand,
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e,
            ),
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
               e,
            ),
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
         console.error("---complateAdd duwmesinde prisma yalnyslygy---", e),
      );
   // if updating went wrong
   if (!addSum) {
      delete ctx.session.sumAddStates[adminId];
      return ctx
         .editMessageText(
            "User Db update error, tazeden synansyn /" + editSummComand,
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e,
            ),
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
         console.error("---complateAdd duwmesinde prisma yalnyslygy---", e),
      );
   // if went wrong
   if (!save) {
      delete ctx.session.sumAddStates[adminId];
      return ctx.api
         .editMessageText(
            adminId,
            sumAddState?.mssgId || 0,
            `Musderin hasaby kopeldildi yone proses hasaba alynmady. Bu bildirisi bellap goyun \n ${user.walNum}`,
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e,
            ),
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
            },
         );
      });
      ctx.api.sendMessage(
         user.id,
         "<blockquote>bot</blockquote>" +
            `Hasabyňyz ${fltdSum} ${chsdCrrnc} ${
               fltdSum > 0 ? "köpeldi." : "azaldy."
            }`,
         {
            parse_mode: "HTML",
         },
      );
      return await ctx.deleteMessage();
   } catch (e) {
      console.error(
         "---complateAdd duwmesinde editMessageText yalnyslygy---",
         e,
      );
      await ctx
         .editMessageText(
            "Proses tutush amala asyryldy yone adminlere yada ulanyja habar berilmedi" +
               e,
         )
         .catch((e) =>
            console.error(
               "---complateAdd duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
});
bot.callbackQuery("complateTransfer", async (ctx) => {
   const userID = ctx.from?.id;
   const transferState = ctx.session.transferStates[userID];
   // validating user
   const sender = await prisma.user
      .findUnique({
         where: {
            id: userID.toString(),
         },
      })
      .catch((error) => {
         console.error("---complateTransfer prisma yalnyslygy---", error);
      });

   if (!sender) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx.editMessageText(
         "Siz hasaba alynmadyk. \n /start komandasy bilen gaýtadan başlaň.",
      );
   }
   // validating receiver walnum exist
   const reciever = await prisma.user
      .findUnique({
         where: { walNum: transferState.recieverWalNum },
      })
      .catch((e) =>
         console.error("---complateTransfer prisma yalnyslygy---", e),
      );

   if (!reciever) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText("Ýalňyş beýle balans ID tapylmady gaýtadan synanşyň.")
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
   // validating if sum is correct
   const fltdSum = transferState?.amount;
   if (
      fltdSum === undefined ||
      isNaN(fltdSum) ||
      fltdSum === 0 ||
      fltdSum < 0
   ) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText("Ýalňyş! Pul mukdary nädogry. Gaýtadan synanşyň.")
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
   // is choosed currency correct
   const chsdCrrnc = transferState?.currency;
   if (typeof chsdCrrnc !== "string" || !(chsdCrrnc in PaymentMethod)) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText("Ýalňyş walyuta, başdan synanşyň ")
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
   // if user has not enough money
   if (
      (chsdCrrnc === "TMT" && sender.sumTmt < fltdSum) ||
      (chsdCrrnc === "USDT" && sender.sumUsdt < fltdSum)
   ) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText("Balansyňyz ýeterlik däl. Gaýtadan synanşyň.")
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
   // if user and reciever are same
   if (sender.id === reciever.id) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx.editMessageText("Özüňden özüňe geçirim amala aşyrylmaýar!");
   }
   // decreasing sender money
   const senderData =
      transferState?.currency === "TMT"
         ? { sumTmt: Number((sender.sumTmt - fltdSum).toFixed(2)) }
         : { sumUsdt: Number((sender.sumUsdt - fltdSum).toFixed(2)) };

   const subSum = await prisma.user
      .update({
         where: {
            id: sender.id,
         },
         data: senderData,
      })
      .catch((e) =>
         console.error(
            "---complateTransfer duwmesinde prisma yalnyslygy---",
            e,
         ),
      );
   // if updating went wrong
   if (!subSum) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText(
            "Biz tarapda bir ýalňyşlyk döredi, haýyş gaýtadan synanyşyň ýa-da adminlere habar beriň.",
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }

   // choosing currency
   const recieverData =
      transferState?.currency === "TMT"
         ? { sumTmt: Number((reciever.sumTmt + fltdSum).toFixed(2)) }
         : { sumUsdt: Number((reciever.sumUsdt + fltdSum).toFixed(2)) };
   // increasing receiver money
   const addSum = await prisma.user
      .update({
         where: {
            id: reciever.id,
         },
         data: recieverData,
      })
      .catch((e) =>
         console.error(
            "---complateTransfer duwmesinde prisma yalnyslygy---",
            e,
         ),
      );
   // if updating went wrong
   if (!addSum) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText(
            "Biz tarapda bir ýalňyşlyk döredi, siziň balansyňyz azaldy ýöne kabul edijiň balansy köpelmedi, haýyş adminlere habar beriň.",
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }

   // save transaction to db
   const save = await prisma.transfer
      .create({
         data: {
            senderid: sender.id,
            recieverid: reciever.id,
            currency: chsdCrrnc as PaymentMethod,
            amount: fltdSum,
         },
      })
      .catch((e) =>
         console.error(
            "---complateTransfer duwmesinde prisma yalnyslygy---",
            e,
         ),
      );
   // if went wrong
   if (!save) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText(
            `Geçirim tamamlandy ýöne proses hasaba alynmady. Bu bildirişi belläp goýuň, mümkin bolsa adminlere habar beriň.`,
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
   ctx.unpinChatMessage(transferState.messageId);
   delete ctx.session.transferStates[userID];
   try {
      adminidS.map((adminId) => {
         ctx.api.sendMessage(
            adminId,
            `geçirim \n Kimden: ${userLink({
               id: Number(ctx.from.id),
               nick: ctx.from.first_name,
            })} \n Kime: ${userLink({
               id: Number(reciever.id),
               nick: reciever.walNum,
            })} \n Mukdar: ${save.amount} ${save.currency}`,
            {
               parse_mode: "HTML",
            },
         );
      });
      ctx.api.sendMessage(
         reciever.id,
         "<blockquote>bot</blockquote>" +
            `Hasabyňyz ${fltdSum} ${chsdCrrnc} ${
               fltdSum > 0 ? "köpeldi." : "azaldy."
            } \n Ugradan: ${userLink({
               id: Number(sender.id),
               nick: sender.walNum,
            })}`,
         {
            parse_mode: "HTML",
         },
      );
      return ctx.editMessageText(
         "<blockquote>bot</blockquote>" +
            `${fltdSum} ${chsdCrrnc} üstünlikli ugradyldy. \n Nirä: ${reciever.walNum}`,
         {
            parse_mode: "HTML",
         },
      );
   } catch (e) {
      console.error(
         "---complateTransfer duwmesinde editMessageText yalnyslygy---",
         e,
      );
      ctx.unpinChatMessage();
      await ctx
         .editMessageText(
            "Proses tutush amala asyryldy yone adminlere yada ulanyja habar berilmedi" +
               e,
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e,
            ),
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
                  ctx.from?.id,
               ),
            );
         });
      } catch (error) {
         console.error(
            "---declineAdd duwmesinde map-sendMessage yalnyslygy---",
            error,
         );
      }
      return ctx
         .reply(isAdmin.mssg)
         .catch((e) =>
            console.error("---declineAdd duwmesinde reply yalnyslygy---", e),
         );
   }
   const sumAddState = ctx.session.sumAddStates[adminId];
   if (!sumAddState) {
      return ctx
         .editMessageText(
            "Hasap goşmak eýýäm ýatyryldy ýa-da amala aşyryldy ýa-da ýalňyşlyk döredi!",
         )
         .catch((e) =>
            console.error(
               "---declineAdd editMessageText reply yalnyslygy---",
               e,
            ),
         );
   }
   delete ctx.session.sumAddStates[adminId];
   return await ctx
      .editMessageText("Hasap goşmak ýatyryldy.")
      .catch((e) =>
         console.error("---declineAdd editMessageText reply yalnyslygy---", e),
      );
});
bot.callbackQuery("declineTransfer", async (ctx) => {
   const userID = ctx.from?.id;
   // if user not admin notify admins

   const sumAddState = ctx.session.transferStates[userID];
   if (!sumAddState) {
      return ctx
         .editMessageText(
            "Hasap goşmak eýýäm ýatyryldy ýa-da amala aşyryldy ýa-da ýalňyşlyk döredi!",
         )
         .catch((e) =>
            console.error(
               "---declineAdd editMessageText reply yalnyslygy---",
               e,
            ),
         );
   }
   ctx.unpinChatMessage(sumAddState.messageId).catch((e) =>
      console.error("---declineTransfer unpinChatMessage yalnyslygy---", e),
   );
   delete ctx.session.transferStates[userID];
   return await ctx
      .editMessageText("Hasap goşmak ýatyryldy.")
      .catch((e) =>
         console.error("---declineAdd editMessageText reply yalnyslygy---", e),
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
               ctx.from?.id,
            ),
         );
      });
      return ctx.reply(isAdmin.mssg);
   }
   const checkState = ctx.session.checkStates[adminId];
   if (!checkState) {
      return ctx
         .editMessageText(
            "Barlag eýýäm ýatyryldy ýa-da amala aşyryldy ýa-da ýalňyşlyk döredi!",
         )
         .catch((e) =>
            console.error(
               "---declineCheck duwmesinde editMessageText yalnyslygy---",
               e,
            ),
         );
   }
   delete ctx.session.checkStates[adminId];
   return await ctx
      .editMessageText("Barlag ýatyryldy.")
      .catch((e) =>
         console.error(
            "---declineCheck duwmesinde editMessageText yalnyslygy---",
            e,
         ),
      );
});

const messageMappings = new Map();
bot.on("message", async (ctx) => {
   const userId = ctx.chat.id;
   const reasonState = ctx.session.reasonStates[userId];
   const sumAddState = ctx.session.sumAddStates[userId];
   const transferState = ctx.session.transferStates[userId];
   const chatState = ctx.session.chatStates[userId];
   const broadcastState = ctx.session.broadcastStates[userId];
   const checkState = ctx.session.checkStates[userId];
   const signupState = ctx.session.signupState[userId];
   const redeemCodeState = ctx.session.redeemCodeState[userId];
   if (ctx.message.pinned_message) {
      return;
   }
   if (reasonState) {
      const reason = ctx.message.text;
      const ordIdmess = ordrIdMssgFnc(reasonState.orderId);
      await bot.api
         .sendMessage(
            reasonState.client,
            `${ordrDclngMssgFnc(userId.toString(), false, reason, true)}`,
            {
               parse_mode: "HTML",
               reply_to_message_id: reasonState.clntMssgId,
            },
         )
         .catch((e) =>
            console.error("---reasonState sendMessage yalnyslygy---", e),
         );
      for (let i = 0; i < adminidS.length; i++) {
         try {
            await bot.api.editMessageText(
               adminidS[i],
               reasonState.mssgIds[i],
               `${ordIdmess} ${ordrDclngMssgFnc(
                  userId.toString(),
                  ctx.from.first_name,
                  reason,
               )}`,
               {
                  parse_mode: "HTML",
               },
            );
         } catch (error) {
            console.error(
               "---reasonState for-editMessageText yalnyslygy---",
               error,
            );
         }
      }
      ctx.deleteMessage().catch((e) =>
         console.error("---reasonState deleteMessage yalnyslygy---", e),
      );
      return delete ctx.session.reasonStates[userId];
   } else if (sumAddState) {
      if (sumAddState.walNum === "") {
         if (!ctx.message.text) {
            delete ctx.session.sumAddStates[userId];
            return ctx
               .reply("Hasap nomer girizilmedi. Başdan synanyşyň.")
               .catch((e) =>
                  console.error("---sumAddState reply yalnyslygy---", e),
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
               },
            )
            .catch((e) =>
               console.error("---sumAddState editMessageText yalnyslygy---", e),
            );
         return await ctx
            .deleteMessage()
            .catch((e) =>
               console.error("---sumAddState deleteMessage yalnyslygy---", e),
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
            console.error("---sumAddState deleteMessage yalnyslygy---", e),
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
               },
            )
            .catch((e) =>
               console.error("---sumAddState editMessageText yalnyslygy---", e),
            );
      }
   } else if (transferState) {
      if (transferState.recieverWalNum === "") {
         if (!ctx.message.text) {
            await ctx
               .unpinChatMessage(transferState.messageId)
               .catch((e) =>
                  console.error(
                     "---transferState unpinChatMessage yalnyslygy---",
                     e,
                  ),
               );
            delete ctx.session.transferStates[userId];
            return ctx
               .reply("Balans ID girizilmedi. Başdan synanyşyň.")
               .catch((e) =>
                  console.error("---transferState reply yalnyslygy---", e),
               );
         }
         const user = await prisma.user.findUnique({
            where: {
               walNum: ctx.message.text,
            },
         });
         if (!user) {
            await ctx
               .unpinChatMessage(transferState.messageId)
               .catch((e) =>
                  console.error(
                     "---transferState unpinChatMessage yalnyslygy---",
                     e,
                  ),
               );
            delete ctx.session.transferStates[userId];
            return ctx
               .reply("Balans ID ýalňyş. Başdan synanyşyň.")
               .catch((e) =>
                  console.error("---transferState reply yalnyslygy---", e),
               );
         }
         transferState.recieverWalNum = ctx.message.text;
         ctx.api
            .editMessageText(
               userId,
               transferState.messageId,
               `Balans ID: ${userLink({
                  id: Number(transferState.recieverWalNum),
               })} \n Walýuta ?`,
               {
                  reply_markup: new InlineKeyboard()
                     .text("TMT", "select_TMT")
                     .row()
                     .text("USDT", "select_USDT")
                     .row()
                     .text("Ýatyr " + statusIcons.care[7], "declineTransfer"),
                  parse_mode: "HTML",
               },
            )
            .catch((e) =>
               console.error("---sumAddState editMessageText yalnyslygy---", e),
            );
         return await ctx
            .deleteMessage()
            .catch((e) =>
               console.error("---sumAddState deleteMessage yalnyslygy---", e),
            );
      } else if (transferState.amount === 0) {
         const sum = ctx.message.text;
         if (!sum && isNaN(Number(sum))) {
            await ctx
               .unpinChatMessage(transferState.messageId)
               .catch((e) =>
                  console.error(
                     "---transferState unpinChatMessage yalnyslygy---",
                     e,
                  ),
               );
            delete ctx.session.transferStates[userId];
            await ctx
               .deleteMessage()
               .catch((e) =>
                  console.error(
                     "---sumAddState deleteMessage yalnyslygy---",
                     e,
                  ),
               );
            return ctx
               .editMessageText("Girizen mukdaryňyz nädogry. Başdan synanyşyň.")
               .catch((e) =>
                  console.error(
                     "---transferState editMessageText yalnyslygy---",
                     e,
                  ),
               );
         }
         transferState.amount = Number(Number(sum).toFixed(2));
         ctx.deleteMessage().catch((e) =>
            console.error("---sumAddState deleteMessage yalnyslygy---", e),
         );
         return ctx.api
            .editMessageText(
               userId,
               transferState.messageId,
               `Balans ID: ${transferState.recieverWalNum} \n ${transferState.amount} ${transferState.currency}`,
               {
                  reply_markup: new InlineKeyboard()
                     .text("Ýalňyş", "declineTransfer")
                     .text("Dogry", "complateTransfer"),
               },
            )
            .catch((e) =>
               console.error("---sumAddState editMessageText yalnyslygy---", e),
            );
      }
   } else if (checkState) {
      const message = ctx.message.text || "";
      await ctx.deleteMessage();
      let user;
      const fromId = await prisma.user.findUnique({
         where: { id: message },
      });
      if (fromId) {
         user = fromId;
      } else {
         const formWal = await prisma.user.findUnique({
            where: { walNum: message },
         });
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
               "Hasap tapylmady, täzeden synanyşyň.",
            )
            .catch((e) =>
               console.error("---checkState editMessageText yalnyslygy---", e),
            );
      }
      const userInfoText = await userInfo({ user });
      delete ctx.session.checkStates[userId];
      return ctx.api
         .editMessageText(userId, checkState.messageId, `${userInfoText}`, {
            parse_mode: "HTML",
         })
         .catch((e) =>
            console.error("---checkState editMessageText yalnyslygy---", e),
         );
   } else if (chatState && chatState.calling && !chatState.userId) {
      const expectingID = ctx.message.text;
      if (!expectingID) {
         return ctx
            .reply("Id ugradyn")
            .catch((e) =>
               console.error("---chatState calling reply yalnyslygy---", e),
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
                  "acceptChat_" + userId,
               ),
            },
         );
         return ctx.reply(
            "Ýüzlenme ugradyldy, kabul edilenden soň habar beriler.",
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
                  error.description,
            );
         }
      }
   } else if (chatState && chatState.userId) {
      if (ctx.message && !ctx.message.pinned_message) {
         let replyToMessageId = undefined;

         // 1. Gelen mesajın bir yanıt olup olmadığını kontrol et
         if (ctx.message.reply_to_message) {
            const originalReplyToMsgId =
               ctx.message.reply_to_message.message_id;
            const sourceChatId = ctx.chat.id;
            const sourceKey = `${sourceChatId}:${originalReplyToMsgId}`;
            const destinationKey = messageMappings.get(sourceKey);

            if (destinationKey) {
               replyToMessageId = parseInt(destinationKey.split(":")[1]);
            }
         }

         try {
            await ctx.api.sendChatAction(chatState.userId, "typing");

            const copiedMessage = await ctx.api.copyMessage(
               chatState.userId,
               ctx.chat.id,
               ctx.message.message_id,
               {
                  reply_to_message_id: replyToMessageId,
               },
            );

            const sourceKey = `${ctx.chat.id}:${ctx.message.message_id}`;
            const destinationKey = `${chatState.userId}:${copiedMessage.message_id}`;

            messageMappings.set(sourceKey, destinationKey);
            messageMappings.set(destinationKey, sourceKey);

            return copiedMessage;
         } catch (e) {
            console.error("---chatState copyMessage hatası---", e);
         }
      }
   } else if (signupState) {
      const message = ctx.message.text;
      if (!message) {
         delete ctx.session.signupState[userId];
         await ctx.api.editMessageText(userId, signupState.message_id, `Error`);
         return;
      }
      const parts = message.split("\n");
      if (parts.length < 2 || parts.length > 2) {
         delete ctx.session.signupState[userId];
         await ctx.api.editMessageText(
            userId,
            signupState.message_id,
            `Format yalnys`,
         );
         return;
      }
      const hashedPassword = await bcrypt.hash(parts[1], 12);
      const data = await prisma.admin.update({
         where: {
            tgId: userId.toString(),
         },
         data: {
            nick: parts[0],
            hashedPassword: hashedPassword,
         },
      });
      if (!data) {
         delete ctx.session.signupState[userId];
         await ctx.api.editMessageText(
            userId,
            signupState.message_id,
            `DB error`,
         );
         return;
      }

      await ctx.api.editMessageText(
         userId,
         signupState.message_id,
         `Nickname: ${parts[0]} \n Parol: ${parts[1]}`,
      );

      return delete ctx.session.signupState[userId];
   } else if (redeemCodeState) {
      const message = ctx.message.text;
      if (!message) {
         delete ctx.session.redeemCodeState[userId];
         await ctx.api.editMessageText(
            userId,
            redeemCodeState.messageId,
            `Error`,
         );
         return;
      }

      const codes = message.split(/[\s,-]+/).filter(Boolean);

      for (const code of codes) {
         await ctx.reply(code);
      }

      delete ctx.session.redeemCodeState[userId];
      await ctx.deleteMessage();
      await ctx.api.deleteMessage(userId, redeemCodeState.messageId);
   } else if (broadcastState) {
      const users = await prisma.user.findMany().catch((e) => {
         console.error("---broadcastState prisma yalnyslygy---", e);
         return [];
      });

      console.log(`Jemi ${users.length} ulanyja habar ugradylýar...`);
      ctx.api.editMessageText(
         userId,
         broadcastState.message_id,
         `Jemi ${users.length} ulanyja habar ugradylýar...`,
      );

      let sentCount = 0;
      let failedCount = 0;
      for (const user of users) {
         try {
            if (user.id === userId.toString()) {
               continue;
            }
            await ctx.api.copyMessage(user.id, userId, ctx.message.message_id, {
               reply_markup: mainKEybiard(ctx.from?.id.toString() || ''),
            });
            console.log(`Habar ugradyldy: ${user.id}`);
            sentCount++;

            await new Promise((resolve) => setTimeout(resolve, 100));
         } catch (error: any) {
            console.error(`Habar ugratma ýalňyşlygy ${user.id}:`, error);
            failedCount++;

            if (
               error.description &&
               error.description.includes("bot was blocked by the user")
            ) {
               console.log(`Ulanyjy boty petikläpdir, ${user.id}`);
            }
         }
      }
      ctx.deleteMessage();
      await ctx.api
         .editMessageText(
            userId,
            broadcastState.message_id,
            `Jemi ${users.length} ulanyjydan ${sentCount} ulanyja habar ugradyldy, ${failedCount} ulanyja habar ugradyp bolmady.`,
         )
         .catch((e) =>
            console.error("---broadcastState reply yalnyslygy---", e),
         );
      delete ctx.session.broadcastStates[userId];
   } else {
      return ctx.reply(welcome, {
         reply_markup: mainKEybiard(ctx.from?.id.toString() || ''),
         parse_mode: "HTML",
      });
   }
});

// Error handling
bot.catch((err) => {
   const ctx = err.ctx;
   console.error(`[Bot Error] ${ctx.update.update_id}:`, err);
});

// Start the bot
bot.start();
console.log("Telegram bot işjeň.");

// Whern prosess is terminated, disconnect from Prisma
process.once("SIGINT", () => prisma.$disconnect());
process.once("SIGTERM", () => prisma.$disconnect());
