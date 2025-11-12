"use client";

import { useCurrency, useQuantity } from "@/utils/UniStore";
import React, { useEffect } from "react";
import ItemAmount from "./ItemAmount";
import { Detail, Details, DetailTitle, Product, Requirements } from "@prisma/client";

interface Props {
   item: Product & { Requirements: Requirements | null } & {
      Details: (Details & {
         Detail: Detail[];
         DetailTitle: DetailTitle | null;
      })[];
   };
}

const ProductPriceCalculator = ({ item }: Props) => {
   const currency = useCurrency((state) => state.currency);

   const quantity = useQuantity((state) => state.quantity);
   const setQuantity = useQuantity((state) => state.change);
   const setTMT = useQuantity((state) => state.changeTMT);
   const setUSDT = useQuantity((state) => state.changeUSDT);

   // Bu useEffect, bileşen ilk kez yüklendiğinde (mount edildiğinde) çalışır.
   // Boş bağımlılık dizisi `[]` sayesinde sadece bir kez çalışır.
   useEffect(() => {
      setQuantity(item.min.toString());
      // setTMT ve setUSDT de ilk yüklenmede set edilebilir.
      setTMT(item.priceTMT);
      setUSDT(item.priceUSDT);
   }, [item.min, item.priceTMT, item.priceUSDT, setQuantity, setTMT, setUSDT]);
   // item.min, priceTMT, priceUSDT, setQuantity, setTMT, setUSDT bağımlılık olarak eklendi.
   // Eğer bu değerler değişirse tekrar çalışır, ancak item.min'in değişmeyeceği varsayılır.
   // Eğer sadece tek bir sefer çalışmasını istiyorsan ve item'in değişmeyeceğinden eminsen [] de kullanabilirsin.
   // Ancak React'ın önerdiği yöntem, kullanılan tüm dış değişkenleri bağımlılık dizisine eklemektir.

   // Eğer setTMT ve setUSDT'nin item.min gibi sadece bir kez ayarlanmasını istiyorsan,
   // onları da aynı useEffect bloğuna taşıyabilirsin.
   if (item.name === "jtn" && (currency === "USDT" || currency === "TON")) {
      return (
         <ItemAmount
            amount={item.min || 0}
            duration={item.duration}
            title={item.title}
         />
      );
   }
   return (
      <input
         className={
            "max-w-[100px] p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400 text-gray-900 bg-white"
         }
         type="text"
         id="quantityInput"
         autoComplete="off"
         value={quantity}
         onChange={(e) => {
            setQuantity(e.target.value.replace(/[^0-9]/g, ""));
         }}
         placeholder={`${item.min} - ${item.max}`}
         onBlur={() => {
            if (Number(quantity) < item.min) {
               setQuantity(item.min.toString());
            } else if (Number(quantity) > item.max) {
               setQuantity(item.max.toString());
            }
            return;
         }}
      />
   );
};

export default ProductPriceCalculator;
