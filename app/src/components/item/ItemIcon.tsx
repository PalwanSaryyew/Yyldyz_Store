"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
const ItemIcon = () => {
   const currentPath = usePathname();
   return (
      <div className={`${currentPath === "/exit" ? "bg-black" : ""} scale-125 p-[0.2rem] rounded-md`}>
         <Image
            src={`/jtns${currentPath}.png`}
            width={28}
            height={28}
            alt=""
            rel="preload"
            priority
         />
      </div>
   );
};

export default ItemIcon;
