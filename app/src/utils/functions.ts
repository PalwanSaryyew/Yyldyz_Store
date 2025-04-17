import { ProductType } from "../../prisma/prismaSett";

export function rndmNmrGnrtr(l: number): string {
   let result = "";
   for (let i = 0; i < l; i++) {
      result += Math.floor(Math.random() * 10);
   }
   return result;
}

export function productNameDisplayer(
   name: ProductType
): "Jeton" | "Ýyldyz" | "Tg Premium" | "UC" {
   return name === "jtn"
      ? "Jeton"
      : name === "star"
      ? "Ýyldyz"
      : name === "tgprem"
      ? "Tg Premium"
      : name === "uc"
      ? "UC"
      : name;
}
