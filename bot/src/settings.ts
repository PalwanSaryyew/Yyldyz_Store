import { Admin, Product, ProductType } from "../prisma/prismaSett";

export const toncoinId = "TONUSDT";
export const tonFee = 0.3;
export const unitPrice: number = 0.015;

export const adminidS = [
   process.env.PALWAN || "1",
   process.env.PALWAN_2 || "2",
   process.env.HAJY || "3",
   process.env.HAJY_2 || "4",
   process.env.YYLDYZ || "5",
   process.env.ABADAN || "6",
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
      "💸",
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
      case "clash":
         return "Clash of Clans";
      case "gpt":
         return "ChatGPT abunasy";
      case "lis":
         return "LIS-SKINS balans";
      case "gplay":
         return "Google Play balans";
      case "apple":
         return "Apple sowgat karty";
      case "belet":
         return "Belet Film tölegi";
      case "alem":
         return "Älem TV tölegi";
      case "bc":
         return "PUBG Mobile Lite BC";
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
   if (tonprice === 0) {
      console.error("Crypto price api error");
      return 0; // Hata durumunda 0 döndür
      
   }
   return Number((USDTPrice / tonprice + tonFee).toFixed(4));
}

export function pricingTiersFunc({
   product,
   quantity,
}: {
   product: Product;
   quantity: number;
}): { tmtPrice: number; usdtPrice: number; amount: number } {
   const pricingTiers = product.pricingTiers as Array<{
      threshold: number;
      discount: number;
   }>;
   let finalUnitPriceTMT = product.priceTMT;
   let finalUnitPriceUSDT = product.priceUSDT;
   for (let i = pricingTiers.length - 1; i >= 0; i--) {
      const tier = pricingTiers[i];
      if (Number(quantity) >= tier.threshold) {
         finalUnitPriceTMT = product.priceTMT * (1 - tier.discount);
         finalUnitPriceUSDT = product.priceUSDT * (1 - tier.discount);
         break; // İlk bulunan uygun kademeyi kullan ve döngüden çık
      }
   }
   return {
      tmtPrice: (product.priceTMT = Number(
         (Number(quantity) * finalUnitPriceTMT).toFixed(2)
      )),
      usdtPrice: (product.priceUSDT = Number(
         (Number(quantity) * finalUnitPriceUSDT).toFixed(2)
      )),
      amount: (product.amount = Number(quantity)),
   };
}

export const ourTonAddress = "UQDi3J28_M_iFFZ9IiukdK7adLkY5SXiMUgWFMFZNAktkDsO";
export const rootUrl = "http://localhost:3000";
export const paths: ProductType[] = [
   "star",
   "tgprem",
   "uc",
   "jtn",
   "exit",
   "pubg",
   "psp",
   "steam",
   "royale",
   "lis",
   'gplay',
   'apple',
   'belet',
   'alem',
   'clash',
   'bc'
];
export const STORAGE_KEY = "lastVisitedPageMyapp";
