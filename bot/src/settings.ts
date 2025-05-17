import {
   Admin,
   PaymentMethod,
   Product,
   ProductType,
   SummUpdate,
   User,
} from "../prisma/prismaSett";

import { Bot } from "grammy";

export interface SessionData {
   chattingWith?: number;
   adminChattingWith?: number;
}

export const bot = new Bot(process.env.BOT_TOKEN || "123");

export const adminidS = [
   process.env.PALWAN || "1",
   process.env.PALWAN_2 || "2",
   process.env.HAJY || "3",
   process.env.HAJY_2 || "4",
];
interface SumAddState {
   mssgId: number;
   walNum: User["walNum"];
   crrncy: PaymentMethod | "";
   sum: SummUpdate["sum"];
}
interface OrdrMsgEdtSt {
   mssgIds: number[];
}
export const reasonStates = new Map();
export const sumAddStates: Map<number | undefined, SumAddState> = new Map();
export const ordrMsgEdtStts: Map<number, OrdrMsgEdtSt> = new Map();
// functions

// admins seed data returner
export function adminDatas(): Admin[] {
   const data: Admin[] = [];
   adminidS.map((adminid) => {
      data.push({
         tgId: adminid as Admin["tgId"],
         createdAt: new Date(),
         updatedAt: new Date(),
         onlineSatus: false,
      });
      return;
   });
   return data;
}

// random number genrator
export function rndmNmrGnrtr(l: number): string {
   let result = "";
   for (let i = 0; i < l; i++) {
      result += Math.floor(Math.random() * 10);
   }
   return result;
}
// product name returner
export function prdctDsplyNme(
   name: ProductType | undefined | Product['title']
): "Jeton" | "Ýyldyz" | "Tg Premium" | "UC" | "Exitlag" | "" | Product['title'] {
   return name === "jtn"
      ? "Jeton"
      : name === "star"
      ? "Ýyldyz"
      : name === "tgprem"
      ? "Tg Premium"
      : name === "uc"
      ? "UC"
      : name === "exit"
      ? "Exitlag"
      : name ?? "";
}

export const editSummComand = "eylenbeylen";

export const statusIcons = {
   yes: ["✔️", "☑️", "✅", "🟢"],
   no: ["❎", "✖️", "❌", "🔴", "⭕"],
   care: ["❕", "ℹ️", "❗", "‼️", "⁉️", "🟡", "⚠️", "🟠"],
   wait: [
      "📦",
      "📨",
      "⌛",
      "🚫",
      "⛔",
      "🕥",
      "🚩",
      "⚡",
      "🛒",
      "📌",
      "📍",
      "⏳",
      "⌚",
      "⏱️",
      "⏲️",
   ],
};
