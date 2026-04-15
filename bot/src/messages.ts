//message returners

import {
   Order,
   PaymentMethod,
   prisma,
   Product,
   User,
} from "../prisma/prismaSett";
import { MyContext } from "./botConf";
import { productTitle, statusIcons, tonPriceCalculator } from "./settings";

export const welcome = `<b>Salam! Sanly dükanymyza hoş geldiňiz! 🛍️

Bu ýerde sanly önümleri aňsat we ygtybarly satyn alyp bilersiňiz. Önümlerimize göz aýlaň we sanly dünýäniň peýdalaryndan lezzet alyň.</b> 

Umumy pikir alyşmak üçin çat: @yyldyzchat
Habarlar we bildirişler üçin kanal: @yyldyzkanal

Balansyňyzy doldurmak we dükanda bolmadyk önümleri sargyt etmek üçin ýa-da soraglaryňyz bar bolsa "Admini çagyr" düwmesine basyň.

<b>Täze söwda tejribesine taýyn bolsaňyz, başlalyň!</b> ✨`;

export function getEmoji(emojiId: string, emojiIcon: string) {
   return `<tg-emoji id="${emojiId}">${emojiIcon}</tg-emoji>`;
}
// hasap message
export function hspMsg(hnum: string, sum1: number, sum2: number) {
   return `Balans ID: <code>${hnum}</code> \n TMT: ${sum1} \n USDT: ${sum2}`;
}
// suspiçius çase message
export function sspcsCaseMs(
   errMssg: string,
   comad: string,
   username?: string,
   id?: number,
) {
   return `${errMssg} \n ulanyjy: @${username} \n id-si: ${id} \n comandy: ${comad}`;
}
// order id block
export function ordrIdMssgFnc(orderId: number) {
   return `<blockquote>Sargyt ID: ${orderId}</blockquote>`;
}
// block text
export function blockText(text: string, expandable?: boolean) {
   return `<blockquote ${expandable ? "expandable" : ""}>${text}</blockquote>`;
}
// produçt details message
export function prdctDtlMssg({
   order,
   forWhom,
}: {
   order: Order & { Product: Product };
   forWhom: "admin" | "client";
}) {
   return ` ${productTitle(order.Product.name)}\n${prdcAmnt({
      quantity: order.quantity,
      title: order.Product.title,
      amount: order.Product.amount,
      duration: order.Product.duration,
   })}${
      forWhom === "client"
         ? ""
         : `Kimden: ${userLink({ id: Number(order.userId) })}\n`
   }${toWhere()}: ${order.receiver}\nJemi töleg: ${orderTotal({
      currency: order.payment,
      product: order.Product,
      total: order.total,
   })}`;
}
export function orderTotal({
   currency,
   product,
   total,
}: {
   total: Order["total"];
   currency: PaymentMethod;
   product: Product;
}) {
   return `<b>${
      total
         ? total
         : currency === "TMT"
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
   isClient: boolean = false,
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
   quantity,
}: {
   quantity: Order["quantity"];
   duration: Product["duration"];
   title: Product["title"];
   amount: Product["amount"];
}) {
   return `${title !== null ? `Haryt: ${title}\n` : ""}${
      amount ? `Mukdary: ${quantity ? quantity : amount}\n` : ""
   }${duration ? `Möhleti: ${duration}\n` : ""}`;
}
// user info
export async function userInfo({
   user,
}: {
   user: User & { username?: string; fullname?: string };
   
}): Promise<string> {
   const userOrders = await prisma.order.findMany({
      where: { userId: user.id, status: "completed" },
   });

   // Tamamlanan sipariş sayısı
   const orderCount = userOrders.length;

   // Harcama toplamlarını tutacağımız değişkenler
   let totalSpentTMT = 0;
   let totalSpentUSDT = 0;

   // Siparişler içinde dönerek ödeme yöntemine göre tutarları (total) topluyoruz
   for (const order of userOrders) {
      const amount = order.total ?? 0; // total değeri null ise 0 sayıyoruz

      // NOT: "TMT" ve "USDT" değerlerini PaymentMethod enum'unuzda nasıl tanımladıysanız
      // o şekilde (örneğin "tmt", "USDT_METHOD" vb.) güncelleyin.
      if (order.payment === "TMT") {
         totalSpentTMT += amount;
      } else if (order.payment === "USDT") {
         totalSpentUSDT += amount;
      }
   }

   return `Ulanyjy: ${userLink({ id: Number(user.id), nick: user.fullname })}\n${user.username ? `Username: @${user.username}\n` : ""}ID: <code>${user.id}</code>\nBalans ID: <code>${user.walNum}</code>\nDöredilen wagty: ${new Date(user.createdAt).toLocaleString("tk-TR")}\nTäzelenen wagty: ${new Date(
      user.updatedAt,
   ).toLocaleString("tk-TR")}\nBalans TMT: ${user.sumTmt}\nBalans USDT: ${
      user.sumUsdt
   }\nBloklanan: ${user.blocked ? "Hawa" : "Ýok"}\nTamamlanan sargyt sany: ${orderCount}\nJemi çykdajy TMT: ${totalSpentTMT}\nJemi çykdajy USDT: ${totalSpentUSDT}`;
}
export function afterOrderConfirmedMess({
   order,
   adminOnlineStatus,
}: {
   order: Order & { Product: Product };
   adminOnlineStatus: boolean;
}): string {
   return `${statusIcons.care[1]} ${
      order.Product.chatRequired
         ? `Sargydyňyz alyndy, bu sargydy tabşyrmak üçin käbir maglumatlar gerek, ${
              adminOnlineStatus
                 ? "admin size ýazar haýyş garaşyň"
                 : "ýöne şu waglykça adminlaryň hiçbiri online däl. Sargydyňyzy ýatyryp ýa-da adminlardan biri size ýazýança garaşyp bilersiňiz"
           }.`
         : "Sargydyňyz alyndy, mümkin bolan iň gysga wagtda size gowşurylar."
   }`;
}
