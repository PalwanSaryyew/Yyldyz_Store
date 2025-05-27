"use client";
import { ProductDescription } from "@/utils/Settings";
import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { usePathname } from "next/navigation";
import { ProductType } from "@prisma/client";
import { productTitle } from "bot/src/settings";

function InfoBox() {
   const pathname = usePathname();
   const prdct = pathname.slice(1);
   const description = ProductDescription({ name: prdct as ProductType });
   const title = productTitle(prdct as ProductType);

   const [isOpen, setIsOpen] = useState(false);

   // Component'in ana kapsayıcı div'i için bir referans oluşturuyoruz
   const collapsibleRef = useRef<HTMLDivElement | null>(null);

   // Tıklama olduğunda çalışacak fonksiyon.
   // Mevcut 'isOpen' değerini tersine çevirir.
   const toggleOpen = () => {
      setIsOpen(!isOpen);
   };

   // Belgeye tıklama olay dinleyicisi eklemek için useEffect kullanıyoruz
   useEffect(() => {
      /**
       * Bu fonksiyon, belge üzerindeki herhangi bir tıklamada çalışır.
       * Tıklamanın, componentimizin dışına olup olmadığını kontrol eder
       * ve dışına ise içeriği kapatır.
       */
      function handleClickOutside(event: MouseEvent): void {
         // Eğer component ref'i tanımlıysa (yani component ekrandaysa)
         // VE tıklanan element (event.target), componentimizin İÇİNDE DEĞİLSE
         if (
            collapsibleRef.current &&
            !collapsibleRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false); // İçeriği kapat
         }
      }

      // 'mousedown' olayını dinlemeye başlıyoruz (genellikle 'click' yerine 'mousedown'
      // kullanmak bu tür "dışarı tıklama" senaryolarında daha tutarlı olabilir).
      document.addEventListener("mousedown", handleClickOutside);

      // useEffect'ten bir temizleme fonksiyonu döndürüyoruz.
      // Component ekrandan kaldırıldığında veya effect yeniden çalıştığında
      // bu fonksiyon çağrılır ve olay dinleyicisini kaldırır.
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [collapsibleRef]); // Bu effect sadece collapsibleRef değiştiğinde yeniden çalışır (ki bu genellikle olmaz)

   return (
      <div ref={collapsibleRef} className="z-20 absolute w-full top-12">
         <div
            className={`${
               isOpen ? "rounded-none" : "rounded-3xl"
            } w-[98%] px-auto bg-white backdrop-blur-[2px] mt-3 mx-auto text-center font-bold text-base py-2 shadow-md shadow-white/60 transition-all`}
            onClick={toggleOpen}
         >
            <div className="flex justify-center items-center gap-2 cursor-pointer">
               {title}
               {description && (
                  <IoIosArrowDropdownCircle
                     color="#60A5FA"
                     size={20}
                     className={` transition duration-500 ${
                        isOpen ? "rotate-180" : ":rotate-0"
                     }`}
                  />
               )}
            </div>
            {description && (
               <div
                  className={`z-20 bg-mainColor origin-top transition duration-300 ease-in-out absolute text-left py-2 px-4 overflow-y-scroll ${
                     isOpen
                        ? "scale-y-100 opacity-100"
                        : "opacity-0 scale-y-0 text-white"
                  }`}
               >
                  <div className="text-white overflow-auto z-20">
                     {description}
                  </div>
               </div>
            )}
         </div>
         
      </div>
   );
}

export default InfoBox;
