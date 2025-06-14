import { Admin, Product, ProductType } from "../prisma/prismaSett";

export const toncoinId = "TONUSDT";
export const tonFee = 0.3;

export const adminidS = [
   process.env.PALWAN || "1",
   process.env.PALWAN_2 || "2",
   process.env.HAJY || "3",
   process.env.HAJY_2 || "4",
   process.env.YYLDYZ || "5",
];

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
   name: ProductType | undefined | Product["title"]
):
   | "Jeton"
   | "Ýyldyz"
   | "Tg Premium"
   | "UC"
   | "Exitlag"
   | ""
   | Product["title"] {
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

export const productTitle = (name: ProductType) => {
   switch (name) {
      case "jtn":
         return "TikTok Jeton";
      case "star":
         return "Telegram Ýyldyz";
      case "tgprem":
         return "Telegram Premium";
      case "uc":
         return "PUBG UC";
      case "exit":
         return "Exitlag";
      case "pubg":
         return "PUBG Mobile";
      case "psp":
         return "PlayStation balans";
      case "steam":
         return "Steam balans";
      case "royale":
         return "Clash Royale";
      case "gpt":
         return "ChatGPT abunasy";
      case "lis":
         return "LIS-SKINS balans";
      case "gplay":
         return "Google Play balans";
      default:
         return "";
   }
};

export async function cmcApi(id: string) {
   try {
      const data = await fetch(
         /* `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`, */
         `https://api.binance.com/api/v3/ticker/price?symbol=${id}`,
         { cache: "no-store" } // Buraya cache: 'no-store' seçeneğini ekliyoruz
      )
         .then((response) => response.json())
         .then((data) => data.price);
      return Number(data);
   } catch (error: unknown) {
      console.log((error as Error).message);
      return 0;
   }
}

export async function tonPriceCalculator(USDTPrice: number): Promise<number> {
   const tonprice = await cmcApi(toncoinId);
   return Number((USDTPrice / tonprice + tonFee).toFixed(4));
}
