//message returners

import { ProductType } from "@prisma/client";
import { prdctDsplyNme, statusIcons } from "./settings";

// hasap message
export function hspMsg(hnum: string, sum1: number, sum2: number) {
   return `Hasap Belgi: <code>${hnum}</code> \n Hasabyňyz: \n ${sum1} TMT \n ${sum2} USDT`;
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
export function prdctDtlMssg(
   product: ProductType,
   amount: number,
   receiver: string,
   total: number,
   currency: string,
   buyerId?: number | string,
   byrName?: string
) {
   return `Haryt: ${prdctDsplyNme(product)} \n ${prdcAmnt(
      product,
      amount
   )} \n ${
      !buyerId ? "" : `Kimden: ${userLink(Number(buyerId), byrName)} \n `
   }${toWhere(
      product
   )}: ${receiver} \n Jemi töleg: <b>${total} ${currency} </b>`;
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
   reason?: string
) {
   return `${statusIcons.no[2]} <a href="tg://user?id=${adminId}">${
      adminNick ? adminNick : "Admin"
   }</a> sargydy ýatyrdy! ${reason ? `\n Sebäbi: ${reason} ` : ""}`;
}
// order delivered by admin
export function ordrCmltdMssgFnc(adminId: number, adminNick?: string) {
   return `${statusIcons.yes[2]} ${userLink(adminId, adminNick)} sargydy tabşyrdy!`;
}
// user link
export function userLink(id: number , nick?: string) {
   return `<a href="tg://user?id=${id}">${nick ? nick : id}</a>`;
}
export function toWhere(product: ProductType) {
   return product === "uc"
      ? "PUBG ID"
      : product === "jtn"
      ? "TikTok Tel.№"
      : "Kime";
}
export function prdcAmnt(product: ProductType, amount: number) {
   return `${product === "tgprem" ? "Wagty" : "Sany"}:  ${
      product === "tgprem" ? amount + " aý" : amount
   }`;
}
