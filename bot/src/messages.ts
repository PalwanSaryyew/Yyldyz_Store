//message returners

import { Order, PaymentMethod, Product } from "../prisma/prismaSett";
import { productTitle, statusIcons, tonPriceCalculator } from "./settings";

export const welcome = `<b>Salam! Sanly dükanymyza hoş geldiňiz! 🛍️

Bu ýerde sanly önümleri aňsat we ygtybarly satyn alyp bilersiňiz. Önümlerimize göz aýlaň we sanly dünýäniň peýdalaryndan lezzet alyň.</b> 

Umumy pikir alyşmak üçin çat: @yyldyzchat
Habarlar we bildirişler üçin kanal: @yyldyzkanal

Balansyňyzy doldurmak, dükanda bolmadyk önümleri sargyt etmek ýa-da soraglaryňyz bar bolsa "Admini çagyr" düwmesine basyň.

<b>Täze söwda tejribesine taýyn bolsaňyz, başlalyň!</b> ✨`;

// hasap message
export function hspMsg(hnum: string, sum1: number, sum2: number) {
   return `Balans ID: <code>${hnum}</code> \n TMT: ${sum1} \n USDT: ${sum2}`;
}
// suspiçius çase message
export function sspcsCaseMs(
   errMssg: string,
   comad: string,
   username?: string,
   id?: number
) {
   return `${errMssg} \n ulanyjy: @${username} \n id-si: ${id} \n comandy: ${comad}`;
}
// order id block
export function ordrIdMssgFnc(orderId: number) {
   return `<blockquote>Sargyt ID: ${orderId}</blockquote>`;
}
// produçt details message
export function prdctDtlMssg({
   order,
   forWhom,
}: {
   order: Order & { product: Product };
   forWhom: "admin" | "client";
}) {
   return ` ${productTitle(order.product.name)}\n${prdcAmnt({
      title: order.product.title,
      amount: order.product.amount,
      duration: order.product.duration,
   })}${
      forWhom === "client"
         ? ""
         : `Kimden: ${userLink({ id: Number(order.userId) })}\n`
   }${toWhere()}: ${order.receiver}\nJemi töleg: ${orderTotal({
      currency: order.payment,
      product: order.product,
   })}`;
}
export function orderTotal({
   currency,
   product,
}: {
   currency: PaymentMethod;
   product: Product;
}) {
   return `<b>${
      currency === "TMT"
         ? product.priceTMT
         : currency === "USDT"
         ? product.priceUSDT
         : tonPriceCalculator(product.priceUSDT)
   } ${currency}</b>`;
}
//asking confirmation meesage
export function prdctCfrmtn() {
   return `<b>${statusIcons.care[6]} Sargyt size degişli bolsa tassyklaň.</b>`;
}
// order delivering by admin
export function ordrDlvrng(tgId: number | string, firstname?: string) {
   return `${statusIcons.care[5]} <a href="tg://user?id=${tgId}">${
      firstname ? firstname : "Admin"
   }</a> sargydy tabşyrýar.`;
}
// order declining bt an admin
export function ordrDclngMssgFnc(
   adminId: string | number,
   adminNick: string | boolean,
   reason?: string,
   isClient: boolean = false
) {
   return `${statusIcons.no[2]} <a href="tg://user?id=${
      isClient ? "" : adminId
   }">${adminNick ? adminNick : "Admin"}</a> sargydy ýatyrdy! ${
      reason ? `\n Sebäbi: ${reason} ` : ""
   }`;
}
// order delivered by admin
export function ordrCmltdMssgFnc(adminId: number, adminNick?: string) {
   return `${statusIcons.yes[2]} ${userLink({
      id: adminId,
      nick: adminNick,
   })} sargydy tabşyrdy!`;
}
// user link
export function userLink({ id, nick }: { id: number; nick?: string }) {
   return `<a href="tg://user?id=${id.toString().trim()}">${
      nick ? nick : id
   }</a>`;
}
export function toWhere() {
   return "Nirä";
}
export function prdcAmnt({
   duration,
   title,
   amount,
}: {
   duration: Product["duration"];
   title: Product["title"];
   amount: Product["amount"];
}) {
   return `${title !== null ? `Haryt: ${title}\n` : ""}${
      amount ? `Mukdary: ${amount}\n` : ""
   }${duration ? `Möhleti: ${duration}\n` : ""}`;
}
