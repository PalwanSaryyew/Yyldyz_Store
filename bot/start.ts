import { InlineKeyboard } from "grammy";
import { prisma } from "./prisma/prismaSett";
import {
   adminidS,
   domain,
   editSummComand,
   pricingTiersFunc,
   statusIcons,
} from "./src/settings";
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
   afterOrderConfirmedMess,
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
import { cnclAddSumBtnn, dlvrOrdrKybrd, mainKEybiard } from "./src/keyboards";
import bcrypt from "bcrypt";
import { getTopSpenders, getUniqueBuyersCount, getUserRank } from "./src/funcs";

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

bot.command("buyers", async (ctx) => {
   try {
      const buyersCount = await getUniqueBuyersCount();

      let message = "📊 *Kullanıcı İstatistikleri*\n\n";
      message += `✅ En az bir kez başarılı sipariş vermiş toplam kullanıcı sayısı: *${buyersCount}*`;

      await ctx.reply(message, { parse_mode: "Markdown" });
   } catch (error) {
      console.error("Buyers sayısını alırken hata oluştu:", error);
      await ctx.reply("Veri alınırken bir hata oluştu.");
   }
});

bot.command("topdamy", async (ctx) => {
   const userId = ctx.from?.id?.toString();
   if (!userId) {
      return ctx.reply("ID alynmady.");
   }

   try {
      await ctx.reply("Reýtingiňiz hasaplanylýar....");
      const rank = await getUserRank(userId);

      if (rank !== null) {
         const chestNum = await prisma.chest.findUnique({
            where: {
               userId: userId,
            },
         });
         await ctx.reply(
            `🏆 Siz Top 100 sanawynda ${rank}. orunynda durýarsyňyz! ${
               chestNum?.id
                  ? "Sandyk belgiňiz: " + chestNum.id
                  : "Derrew sandyk saýlaň 👉 /sandyk 👈 "
            }`
         );
      } else {
         await ctx.reply("😔 Bagyşlaň, siz Top 100 sanawyna girmediňiz.");
      }
   } catch (error) {
      console.error("Sıralama hatası:", error);
      await ctx.reply("Tertipleme netijelerini almakda ýalňyşlyk ýüze çykdy.");
   }
});

/* bot.command(["top10", "top100"], async (ctx) => {
   try {
      const limit = ctx.message?.text?.includes("100") ? 100 : 10;
      const loadingMsg = await ctx.reply(
         `⌛ <b>En çok harcama yapan ${limit} kullanıcı hesaplanıyor...</b>`,
         { parse_mode: "HTML" }
      );

      const topSpenders = await getTopSpenders(limit);

      if (topSpenders.length === 0) {
         return ctx.reply("Henüz harcama kaydı bulunamadı.");
      }

      let message = `<b>🏆 En Çok Harcama Yapan ${limit} Kullanıcı (TMT)</b>\n\n`;
      const chunks: string[] = [];

      topSpenders.forEach((user, index) => {
         const rank = index + 1;
         const medal =
            rank === 1
               ? "🥇"
               : rank === 2
               ? "🥈"
               : rank === 3
               ? "🥉"
               : `<b>${rank}.</b>`;

         // <code> etiketi metni kopyalanabilir yapar
         const copyableId = `<code>${user.userId}</code>`;

         let line = `${medal} ID: ${copyableId} — <b>${user.total.toLocaleString(
            "tr-TR"
         )} TMT</b>\n`;

         if ((message + line).length > 4000) {
            chunks.push(message);
            message = "";
         }
         message += line;
      });

      chunks.push(message);

      // İlk mesajı (Yükleniyor...) silip sonuçları gönderelim
      await ctx.api
         .deleteMessage(ctx.chat.id, loadingMsg.message_id)
         .catch(() => {});

      for (const chunk of chunks) {
         if (chunk.trim().length > 0) {
            await ctx.reply(chunk, { parse_mode: "HTML" });
         }
      }
   } catch (error) {
      console.error("Top listesi hatası:", error);
      await ctx.reply("Sıralama listesi oluşturulurken bir hata oluştu.");
   }
}); */

bot.command(["top10id", "top100id"], async (ctx) => {
   try {
      const limit = ctx.message?.text?.includes("100") ? 100 : 10;
      await ctx.reply(
         `📊 En çok harcama yapan ${limit} kullanıcı hesaplanıyor...`
      );

      const topSpenders = await getTopSpenders(limit);

      if (topSpenders.length === 0) {
         return ctx.reply("Henüz harcama kaydı bulunamadı.");
      }

      // Başlık HTML formatında
      let message = `<b>🏆 En Çok Harcama Yapan ${limit} Kullanıcı (TMT)</b>\n\n`;
      const chunks: string[] = [];

      topSpenders.forEach((user, index) => {
         const rank = index + 1;
         const medal =
            rank === 1
               ? "🥇"
               : rank === 2
               ? "🥈"
               : rank === 3
               ? "🥉"
               : `<b>${rank}.</b>`;

         // HTML Link yapısı: <a href="URL">Metin</a>
         // Not: user.userId'nin sayısal Telegram ID olması gerekir.
         const userLink = `<a href="tg://user?id=${user.userId}">${user.userId}</a>`;

         let line = `${medal} ${userLink} — <b>${user.total.toLocaleString(
            "tr-TR"
         )} TMT</b>\n`;

         // 4000 karakter sınırı kontrolü
         if ((message + line).length > 4000) {
            chunks.push(message);
            message = "";
         }
         message += line;
      });

      chunks.push(message);

      for (const chunk of chunks) {
         if (chunk.trim().length > 0) {
            await ctx.reply(chunk, { parse_mode: "HTML" });
         }
      }
   } catch (error) {
      console.error("Top listesi hatası:", error);
      await ctx.reply("Sıralama listesi oluşturulurken bir hata oluştu.");
   }
});
bot.command(["top10", "top100"], async (ctx) => {
   try {
      const limit = ctx.message?.text?.includes("100") ? 100 : 10;
      await ctx.reply(`📊 Iň işjeň ${limit} ulanyjy hasaplanyar...`);

      const topSpenders = await getTopSpenders(limit);

      if (topSpenders.length === 0) {
         return ctx.reply("Tapylmady.");
      }

      // Başlık HTML formatında
      let message = `<b>🏆 Iň işjeň ${limit} Ulanyjy</b>\n\n`;
      const chunks: string[] = [];

      topSpenders.forEach((user, index) => {
         const rank = index + 1;
         const medal =
            rank === 1
               ? "🥇"
               : rank === 2
               ? "🥈"
               : rank === 3
               ? "🥉"
               : `<b>${rank})</b>`;

         // HTML Link yapısı: <a href="URL">Metin</a>
         // Not: user.userId'nin sayısal Telegram ID olması gerekir.
         const userLink = `<a href="tg://user?id=${user.userId}">${user.walNum}</a>`;

         let line = `${medal} ${userLink}\n`;

         // 4000 karakter sınırı kontrolü
         if ((message + line).length > 4000) {
            chunks.push(message);
            message = "";
         }
         message += line;
      });

      chunks.push(message);

      for (const chunk of chunks) {
         if (chunk.trim().length > 0) {
            await ctx.reply(chunk, { parse_mode: "HTML" });
         }
      }
   } catch (error) {
      console.error("Top listesi hatası:", error);
      await ctx.reply("Yalnyslyk yuze cykdy.");
   }
});

// bot start command
bot.command("start", async (ctx) => {
   const userID = ctx.from?.id;
   // çreating user to do geting message permission
   const user = await userValid(userID, true);
   const param = ctx.match;
   if (param === "calladmin") {
      return ctx.reply("Balansyňyzy doldurmak üçin admini çagyryň.", {
         reply_markup: mainKEybiard,
      });
   }

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
               "cancelBroad_" + ctx.from.id
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
/* start command */
bot.command("test", async (ctx) => {
   ctx.reply(`${statusIcons.yes} \n ${statusIcons.no} \n ${statusIcons.care}`, {
      parse_mode: "HTML",
   }).catch((e) => {
      console.error("---test komandasynda reply yalnyslygy---", e);
   });
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
bot.command("0804", async (ctx) => {
   const userID = ctx.from?.id;
   if (!userID) {
      return;
   }
   if (ctx.session.transferStates[userID]) {
      return ctx
         .reply("Birinji öňki geçirimi tamamlaň, soňra täzeden synanyşyň!")
         .catch((e) =>
            console.error("---reply komandynda deleteMessage yalnyslygy---", e)
         );
   }

   // asking walnum
   const message = await ctx
      .reply(`Kabul edijiniň balans ID-si?`, {
         reply_markup: new InlineKeyboard().text(
            "Ýatyr " + statusIcons.care[7],
            "declineTransfer"
         ),
      })
      .catch((e) =>
         console.error("---transfer komandynda reply yalnyslygy---", e)
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
               e
            )
      );
      return ctx.answerCallbackQuery({
         text: "Geçirimi hökman tamamlaň ýa-da ýatyryň",
      });
   }
   delete ctx.session.transferStates[userID];
   return ctx
      .reply("Ýalňyşlyk ýüze çykdy täzeden synanyşyň.")
      .catch((e) =>
         console.error("---transfer komandynda reply yalnyslygy---", e)
      );
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
            user.mssg + " \n Täzeden synanşyň ýa-da /start berip boty başladyň"
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
   if (isAdminId(userID).error === false) {
      return await ctx.reply("Admin admini çagyryp bilmeýär!").catch((e) => {
         console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
      });
   }
   if (ctx.session.transferStates[userID]) {
      return await ctx
         .reply(
            "Geçirimi açyk wagty admin çagyryp bolmaýar. Geçirimiňizi tamamlap ýa-da ýatyryp admini gaýtadan çagyryň.",
            {
               reply_to_message_id:
                  ctx.session.transferStates[userID].messageId,
            }
         )
         .catch((e) => {
            console.error("---Admini çagyr duwmesinde reply yalnyslygy---", e);
         });
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
               e
            );
         });
   }
   if (ctx.session.chatStates[userID].userId !== 0) {
      return await ctx.editMessageText(
         "Admin häzir başga söhbetdeşlikde, admini özüňiz çagyryň."
      );
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
               {
                  parse_mode: "HTML",
                  reply_markup:
                     adminidS[i] === acceptorId.toString()
                        ? new InlineKeyboard().copyText(
                             userID.toString(),
                             userID.toString()
                          )
                        : undefined,
               }
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

   if (order.quantity) {
      const { tmtPrice, usdtPrice, amount } = pricingTiersFunc({
         product: order.Product,
         quantity: order.quantity,
      });
      order.Product.priceTMT = tmtPrice;
      order.Product.priceUSDT = usdtPrice;
      order.Product.amount = amount;
   }

   // order belongs to this user ?
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
            const data = await ctx.api.sendMessage(
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
                       "cancelOrder_" + order.id
                    ),
         }
      );
      if (sentMessageToClient !== true) {
         ctx.session.ordrMsgEdtStts[orderId] = {
            mssgIds: mssgIds,
            clntMssgId: sentMessageToClient.message_id,
         };
      } else {
         console.error(
            "Ulanyjy sargydy kabul edende yalnyslyk doredi. Ulanjy: ",
            clntID,
            ", Sargyt ID: ",
            orderId
         );
      }

      /* .catch((e) =>
               console.error(
               "---acceptOrder duwmesinde editMessageText yalnyslygy---",
               e
            )
         ); */
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
         where: {
            id: order.User.id,
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
      return await ctx
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
               e
            )
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
         : {
              sumUsdt:
                 order.User.sumUsdt +
                 (order.total ? order.total : order.Product.priceUSDT),
           };
   const userData = await prisma.user
      .update({
         where: {
            id: order.User.id,
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

      const clntMssgId = ctx.session.ordrMsgEdtStts[orderId].clntMssgId;
      const clientMessage = `${ordrIdMssgFnc(
         order.id
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

      const clntMssgId = ctx.session.ordrMsgEdtStts[orderId].clntMssgId;
      await bot.api
         .sendMessage(
            order.userId,
            `${statusIcons.wait[0]} Sargydyňyz tabşyryldy`,
            {
               parse_mode: "HTML",
               reply_to_message_id: clntMssgId,
            }
         )
         .catch((e) =>
            console.error(
               "---orderDelivered duwmesinde sendMessage yalnyslygy---",
               e
            )
         );
      const clientMessage = `${ordrIdMssgFnc(
         order.id
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
               e
            )
         );
   }
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
bot.callbackQuery(/^select_(\w+)$/, (ctx) => {
   const userID = ctx.from?.id;
   const transferState = ctx.session.transferStates[userID];

   // set çurrençy
   if (transferState) {
      transferState.currency = ctx.match[1] as PaymentMethod;
   }
   // next message
   return ctx
      .editMessageText(
         /* adminId,
      sumAddState?.mssgId || 0, */
         `Balans ID: ${transferState?.recieverWalNum} \n Näçe ? ${transferState?.currency}`,
         {
            reply_markup: new InlineKeyboard().text(
               "Ýatyr " + statusIcons.care[7],
               "declineTransfer"
            ),
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
         "<blockquote>bot</blockquote>" +
            `Hasabyňyz ${fltdSum} ${chsdCrrnc} ${
               fltdSum > 0 ? "köpeldi." : "azaldy."
            }`,
         {
            parse_mode: "HTML",
         }
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
         "Siz hasaba alynmadyk. \n /start komandasy bilen gaýtadan başlaň."
      );
   }
   // validating receiver walnum exist
   const reciever = await prisma.user
      .findUnique({
         where: { walNum: transferState.recieverWalNum },
      })
      .catch((e) =>
         console.error("---complateTransfer prisma yalnyslygy---", e)
      );

   if (!reciever) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText("Ýalňyş beýle balans ID tapylmady gaýtadan synanşyň.")
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e
            )
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
               e
            )
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
               e
            )
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
               e
            )
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
         console.error("---complateTransfer duwmesinde prisma yalnyslygy---", e)
      );
   // if updating went wrong
   if (!subSum) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText(
            "Biz tarapda bir ýalňyşlyk döredi, haýyş gaýtadan synanyşyň ýa-da adminlere habar beriň."
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e
            )
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
         console.error("---complateTransfer duwmesinde prisma yalnyslygy---", e)
      );
   // if updating went wrong
   if (!addSum) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText(
            "Biz tarapda bir ýalňyşlyk döredi, siziň balansyňyz azaldy ýöne kabul edijiň balansy köpelmedi, haýyş adminlere habar beriň."
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e
            )
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
         console.error("---complateTransfer duwmesinde prisma yalnyslygy---", e)
      );
   // if went wrong
   if (!save) {
      ctx.unpinChatMessage(transferState.messageId);
      delete ctx.session.transferStates[userID];
      return ctx
         .editMessageText(
            `Geçirim tamamlandy ýöne proses hasaba alynmady. Bu bildirişi belläp goýuň, mümkin bolsa adminlere habar beriň.`
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
               e
            )
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
            }
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
         }
      );
      return ctx.editMessageText(
         "<blockquote>bot</blockquote>" +
            `${fltdSum} ${chsdCrrnc} üstünlikli ugradyldy. \n Nirä: ${reciever.walNum}`,
         {
            parse_mode: "HTML",
         }
      );
   } catch (e) {
      console.error(
         "---complateTransfer duwmesinde editMessageText yalnyslygy---",
         e
      );
      ctx.unpinChatMessage();
      await ctx
         .editMessageText(
            "Proses tutush amala asyryldy yone adminlere yada ulanyja habar berilmedi" +
               e
         )
         .catch((e) =>
            console.error(
               "---complateTransfer duwmesinde editMessageText yalnyslygy---",
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
bot.callbackQuery("declineTransfer", async (ctx) => {
   const userID = ctx.from?.id;
   // if user not admin notify admins

   const sumAddState = ctx.session.transferStates[userID];
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
   ctx.unpinChatMessage(sumAddState.messageId).catch((e) =>
      console.error("---declineTransfer unpinChatMessage yalnyslygy---", e)
   );
   delete ctx.session.transferStates[userID];
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

// /sandik Komutu: Sandıkları Listeler
bot.command("sandyk", async (ctx) => {
   const chests = await prisma.chest.findMany({
      where: {
         userId: {
            not: null,
         },
      },
      orderBy: { id: "asc" },
      include: { User: true },
   });

   const premiumCount = chests.filter((c) => c.type === "PREMIUM").length;
   const normalCount = chests.filter((c) => c.type === "NORMAL").length;

   let message = "<b>🎄 Täze ýyl sandyklary:</b>\n\n";
   message += `🎀 <i>Saýlanan Premium Sandyklar: ${premiumCount}</i>\n`;
   message += `🎁 <i>Saýlanan Adaty Sandyklar: ${normalCount}</i>\n\n`;

   chests.forEach((c) => {
      const icon = c.type === "PREMIUM" ? "🎀" : "🎁";
      const owner = `<a href="tg://user?id=${c.userId}">${c.fullname}</a>`;
      const reward = `${c.reward ? c.reward : ""}`;

      message += `Sandyk ${c.id} \n${owner} \n${icon} ${reward} \n\n`;

      // Mesaj çok uzun olursa bölmek gerekebilir (opsiyonel)
   });

   (message += "🎁 Sandyk Saýlama Çäresi Gutardy!"),
      await ctx.reply(message, { parse_mode: "HTML" });
});

// Buton İşlemi
/* bot.callbackQuery("chest_choosing", async (ctx) => {
   const userId = ctx.from.id.toString();
   const rank = await getUserRank(userId);

   if (!rank) {
      return ctx.answerCallbackQuery({
         text: "Gynansakda siz Top 100-de däl!",
         show_alert: true,
      });
   }

   // Kullanıcının zaten sandığı var mı?
   const existingChest = await prisma.chest.findUnique({ where: { userId } });
   if (existingChest) {
      return ctx.answerCallbackQuery({
         text: `Siz ${existingChest.id} belgili sandygy saýlapsyňyz!`,
         show_alert: true,
      });
   }

   const rangeText = rank <= 10 ? "1-10" : "11-100";
   await ctx.reply(
      `Gutlaýan siziň Top 100 sanawyndaky reýtingiňiz: <b>${rank}</b>. Indi bolsa saýlamak isleýän sandygyňyzyň belgisini giriziň. (${rangeText}):`,
      {
         parse_mode: "HTML",
         reply_markup: { force_reply: true }, // Kullanıcının direkt cevap vermesini sağlar
      }
   );
   await ctx.answerCallbackQuery();
}); */

type ChestType = "NORMAL" | "PREMIUM";

bot.command("payla", async (ctx) => {
   const chestType = "NORMAL" as ChestType;
   if (!ctx.from?.id) {
      return;
   }
   const admin = adminValid(ctx.from?.id);
   if (admin.error) {
      return ctx.reply(admin.mssg);
   }

   const chests = await prisma.chest.findMany({
      where: {
         userId: {
            not: null,
         },
         type: chestType,
      },
   });

   if (chests.length === 0) {
      return ctx.reply("No chests found");
   }

   ctx.session.paylaState[ctx.from.id] = {
      chestType,
      count: chests.length,
   };

   return ctx.reply(`${
      chestType === "NORMAL" ? "Adaty" : "Premium"
   } sandyklar tapyldy: ${chests.length}. Indi baýraklary şu formatda iberiň:
5x baýragyň ady
1x baýragyň ady
12x baýragyň ady`);
});

bot.command("paylaprem", async (ctx) => {
   const chestType = "PREMIUM" as ChestType;
   if (!ctx.from?.id) {
      return;
   }
   const admin = adminValid(ctx.from?.id);
   if (admin.error) {
      return ctx.reply(admin.mssg);
   }

   const chests = await prisma.chest.findMany({
      where: {
         userId: {
            not: null,
         },
         type: chestType,
      },
   });

   if (chests.length === 0) {
      return ctx.reply("No chests found");
   }

   ctx.session.paylaState[ctx.from.id] = {
      chestType,
      count: chests.length,
   };

   return ctx.reply(`${
      chestType === "NORMAL" ? "Adaty" : "Premium"
   } sandyklar tapyldy: ${chests.length}. Indi baýraklary şu formatda iberiň:
5x baýragyň ady
1x baýragyň ady
12x baýragyň ady`);
});

bot.command("arassala", async (ctx) => {
   const admin = adminValid(ctx.from?.id);
   if (admin.error) {
      return ctx.reply(admin.mssg);
   }

   await prisma.chest.updateMany({
      data: {
         reward: null,
      },
   });

   return ctx.reply(" ähli baýraklar üstünlikli arassalandy.");
});

const messageMappings = new Map();
bot.on("message", async (ctx) => {
   // Chest selection reply logic is now at the top of the generic handler
   /* if (
      ctx.message.text &&
      ctx.message.reply_to_message?.text?.includes(
         "Indi bolsa saýlamak isleýän sandygyňyzyň belgisini giriziň"
      )
   ) {
      const userId = ctx.from.id.toString();
      const chestId = parseInt(ctx.message.text);

      if (isNaN(chestId) || chestId < 1 || chestId > 100) {
         return ctx.reply("Ýalňyş san! 1 bilen 100 aralygynda san giriziň.", {
            reply_markup: { remove_keyboard: true },
         });
      }

      const existingChest = await prisma.chest.findUnique({
         where: { userId },
      });
      if (existingChest) {
         return ctx.reply(
            `Siz ${existingChest.id} belgili sandygy eýýäm saýlapsyňyz!`,
            { reply_markup: { remove_keyboard: true } }
         );
      }

      const rank = await getUserRank(userId);
      if (!rank)
         return ctx.reply("Sen Top 100 sanawynda ýok.", {
            reply_markup: { remove_keyboard: true },
         });

      if (rank <= 10 && chestId > 10) {
         return ctx.reply(
            "Siz Top 10 sanawynda, diňe 1-10 belgili Premium sandyklary saýlap bilersiňiz!",
            { reply_markup: { remove_keyboard: true } }
         );
      }
      if (rank > 10 && chestId <= 10) {
         return ctx.reply(
            "1-10 belgili Premium sandyklary diňe Top 10 müşderilere niýetlenen!",
            { reply_markup: { remove_keyboard: true } }
         );
      }

      try {
         const updatedChest = await prisma.$transaction(async (prisma) => {
            const chest = await prisma.chest.findUnique({
               where: { id: chestId },
            });

            if (!chest) {
               throw new Error("CHEST_NOT_FOUND");
            }
            if (chest.userId) {
               throw new Error("ALREADY_TAKEN");
            }
            if (rank <= 10 && chest.type !== "PREMIUM") {
               throw new Error("INVALID_CHEST_TYPE_PREMIUM");
            }
            if (rank > 10 && chest.type !== "NORMAL") {
               throw new Error("INVALID_CHEST_TYPE_NORMAL");
            }

            const updated = await prisma.chest.update({
               where: { id: chestId },
               data: {
                  userId: userId,
                  fullname: `${ctx.from.first_name} ${
                     ctx.from.last_name ? ctx.from.last_name : ""
                  }`,
               },
            });
            return updated;
         });

         await ctx.reply(
            `🎉 Gutlaýan! <b>${updatedChest.id}</b> belgili sandyk indi siziňki.`,
            { parse_mode: "HTML", reply_markup: { remove_keyboard: true } }
         );
      } catch (error: any) {
         if (error.message === "ALREADY_TAKEN" || error.code === "P2025") {
            await ctx.reply(
               `Gynansak-da, bu sandyk başga biri tarapyndan eýýäm saýlandy! Täzeden synanyşyň.`,
               { reply_markup: { remove_keyboard: true } }
            );
         } else if (error.message === "CHEST_NOT_FOUND") {
            await ctx.reply(
               "Gynansak-da, bu sandyk tapylmady! Täzeden synanyşyň.",
               {
                  reply_markup: { remove_keyboard: true },
               }
            );
         } else if (error.message === "INVALID_CHEST_TYPE_PREMIUM") {
            await ctx.reply(
               "Siz Top 10 sanawynda, diňe PREMIUM sandyklary saýlap bilersiňiz!",
               {
                  reply_markup: { remove_keyboard: true },
               }
            );
         } else if (error.message === "INVALID_CHEST_TYPE_NORMAL") {
            await ctx.reply(
               "PREMIUM sandyklary diňe Top 10 müşderilere niýetlenen!",
               {
                  reply_markup: { remove_keyboard: true },
               }
            );
         } else {
            console.error("Error claiming chest:", error);
            await ctx.reply(
               "Sandyk alynýarka garaşylmadyk ýalňyşlyk ýüze çykdy. Soňra gaýtadan synanyşmagyňyzy haýyş edýäris.",
               { reply_markup: { remove_keyboard: true } }
            );
         }
      }
      return;
   } */

   const userId = ctx.chat.id;
   const reasonState = ctx.session.reasonStates[userId];
   const sumAddState = ctx.session.sumAddStates[userId];
   const transferState = ctx.session.transferStates[userId];
   const chatState = ctx.session.chatStates[userId];
   const broadcastState = ctx.session.broadcastStates[userId];
   const checkState = ctx.session.checkStates[userId];
   const signupState = ctx.session.signupState[userId];
   const paylaState = ctx.session.paylaState[ctx.from.id];
   if (ctx.message.pinned_message) {
      return;
   }
   if (paylaState) {
      const admin = adminValid(ctx.from?.id);
      if (admin.error) {
         return ctx.reply(admin.mssg);
      }

      if (!ctx.message?.text) {
         return ctx.reply("Hat iberin.");
      }

      const rewards: string[] = [];
      const lines = ctx.message.text.split("\n");

      for (const line of lines) {
         const match = line.match(/(\d+)x (.+)/);
         if (match) {
            const count = parseInt(match[1]);
            const name = match[2];
            for (let i = 0; i < count; i++) {
               rewards.push(name);
            }
         }
      }

      if (rewards.length === 0) {
         return ctx.reply("Baýraklar tapylmady. Dogry formatda iberiň.");
      }

      const chests = await prisma.chest.findMany({
         where: {
            userId: {
               not: null,
            },
            type: paylaState.chestType,
         },
      });

      if (chests.length === 0) {
         return ctx.reply("No chests found");
      }

      // Shuffle rewards
      for (let i = rewards.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [rewards[i], rewards[j]] = [rewards[j], rewards[i]];
      }

      for (let i = 0; i < chests.length; i++) {
         await prisma.chest.update({
            where: {
               id: chests[i].id,
            },
            data: {
               reward: rewards[i] || "Empty",
            },
         });
      }

      delete ctx.session.paylaState[ctx.from.id];

      return ctx.reply("Baýraklar üstünlikli paýlandy.");
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
   } else if (transferState) {
      if (transferState.recieverWalNum === "") {
         if (!ctx.message.text) {
            await ctx
               .unpinChatMessage(transferState.messageId)
               .catch((e) =>
                  console.error(
                     "---transferState unpinChatMessage yalnyslygy---",
                     e
                  )
               );
            delete ctx.session.transferStates[userId];
            return ctx
               .reply("Balans ID girizilmedi. Başdan synanyşyň.")
               .catch((e) =>
                  console.error("---transferState reply yalnyslygy---", e)
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
                     e
                  )
               );
            delete ctx.session.transferStates[userId];
            return ctx
               .reply("Balans ID ýalňyş. Başdan synanyşyň.")
               .catch((e) =>
                  console.error("---transferState reply yalnyslygy---", e)
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
      } else if (transferState.amount === 0) {
         const sum = ctx.message.text;
         if (!sum && isNaN(Number(sum))) {
            await ctx
               .unpinChatMessage(transferState.messageId)
               .catch((e) =>
                  console.error(
                     "---transferState unpinChatMessage yalnyslygy---",
                     e
                  )
               );
            delete ctx.session.transferStates[userId];
            await ctx
               .deleteMessage()
               .catch((e) =>
                  console.error("---sumAddState deleteMessage yalnyslygy---", e)
               );
            return ctx
               .editMessageText("Girizen mukdaryňyz nädogry. Başdan synanyşyň.")
               .catch((e) =>
                  console.error(
                     "---transferState editMessageText yalnyslygy---",
                     e
                  )
               );
         }
         transferState.amount = Number(Number(sum).toFixed(2));
         ctx.deleteMessage().catch((e) =>
            console.error("---sumAddState deleteMessage yalnyslygy---", e)
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
               }
            )
            .catch((e) =>
               console.error("---sumAddState editMessageText yalnyslygy---", e)
            );
      }
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
               }
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
            `Format yalnys`
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
            `DB error`
         );
         return;
      }

      await ctx.api.editMessageText(
         userId,
         signupState.message_id,
         `Nickname: ${parts[0]} \n Parol: ${parts[1]}`
      );

      return delete ctx.session.signupState[userId];
   } else if (broadcastState) {
      const users = await prisma.user.findMany().catch((e) => {
         console.error("---broadcastState prisma yalnyslygy---", e);
         return [];
      });

      console.log(`Jemi ${users.length} ulanyja habar ugradylýar...`);
      ctx.api.editMessageText(
         userId,
         broadcastState.message_id,
         `Jemi ${users.length} ulanyja habar ugradylýar...`
      );

      let sentCount = 0;
      let failedCount = 0;
      for (const user of users) {
         try {
            if (user.id === userId.toString()) {
               continue;
            }
            await ctx.api.copyMessage(user.id, userId, ctx.message.message_id, {
               reply_markup: mainKEybiard,
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
            `Jemi ${users.length} ulanyjydan ${sentCount} ulanyja habar ugradyldy, ${failedCount} ulanyja habar ugradyp bolmady.`
         )
         .catch((e) =>
            console.error("---broadcastState reply yalnyslygy---", e)
         );
      delete ctx.session.broadcastStates[userId];
   }
   //! barik mainketboardy goy
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
