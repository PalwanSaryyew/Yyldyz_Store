import { Order } from "../prisma/prismaSett";
import { adminidS, EmojiIds } from "./settings";
import { InlineKeyboard, Keyboard } from "grammy";

// order confirmation admins buton
export function dlvrOrdrKybrd(order: Order) {
   const completeOrder = new InlineKeyboard()
      .text("Kabul Et", "deliverOrder_" + order.id)
      .style("primary");
   /* .row()
      .text("Ýatyr " + statusIcons.no[3], "declineOrder_" + order.id)
      .row()
      .copyText(order.receiver, order.receiver); */
   return completeOrder;
}
// order confiramtion clients buuton
export function ordrcnfrmtnkybrd(orderId: number) {
   const keybrd = new InlineKeyboard()
      .text("Tassykla", "acceptOrder_" + orderId)
      .style("success")
      .icon(EmojiIds.yes)
      .row()
      .text("Ýatyr", "cancelOrder_" + orderId)
      .style("danger")
      .icon(EmojiIds.no)
      .row();

   return keybrd;
}
// cancel add summ button
export function cnclAddSumBtnn() {
   return new InlineKeyboard().text("Ýatyr", "declineAdd").style("danger");
}
// main client keyboard
export function mainKEybiard(userID: string) {
   const userKeyboard = new Keyboard()
      .text("Dükana gir 🛒")
      .style("primary")
      .row()
      .text("Balans")
      .style("primary")
      .text("Admini çagyr")
      .style("primary")
      .resized()
      .persistent();

   const adminKeyboard = new Keyboard()
      .text("-Çagyr-")
      .text("-Barla-")
      .text("-Hasap-")
      .row()
      .text("Dükana gir 🛒")
      .style("primary")
      .row()
      .text("Balans")
      .style("primary")
      .text("Admini çagyr")
      .style("primary")
      .resized()
      .persistent();

   const isAdmin = adminidS.includes(userID);

   if (isAdmin) return adminKeyboard;
   return userKeyboard;
}
