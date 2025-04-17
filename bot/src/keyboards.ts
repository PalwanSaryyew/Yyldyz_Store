import { Order } from "@prisma/client";
import { statusIcons } from "./settings";
import { InlineKeyboard } from "grammy";

// order confirmation admins buton
export function dlvrOrdrKybrd(order: Order) {
   const completeOrder = new InlineKeyboard()
      .text("Kabul Et " + statusIcons.yes[3], "deliverOrder_" + order.id)
      .row()
      .text("Ýatyr " + statusIcons.no[3], "declineOrder_" + order.id)
      .row()
      .copyText(order.receiver, order.receiver);
   return completeOrder;
}
// order confiramtion clients buuton
export function ordrcnfrmtnkybrd(orderId: number) {
   const keybrd = new InlineKeyboard()
      .text("Tassykla " + statusIcons.yes[3], "acceptOrder_" + orderId)
      .row()
      .text("Ýatyr " + statusIcons.no[3], "cancelOrder_" + orderId);

   return keybrd;
}
// cancel add summ button
export function cnclAddSumBtnn() {
   return new InlineKeyboard().text(
      "Ýatyr " + statusIcons.care[7],
      "declineAdd"
   );
}
