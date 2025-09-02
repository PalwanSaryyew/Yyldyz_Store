"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";

const ItemIcon = ({ picture }: { picture: string | null}) => {
   const currentPath = usePathname();
   return (
      <div
         className={`${
            currentPath === "/exit" ? "bg-black" : ""
         } w-[30px] h-[30px] scale-125 p-[0.2rem] rounded-md relative`}
      >
         <Image
            src={picture ? picture : `/jtns${currentPath}.png`}
            alt={currentPath}
            rel="preload"
            priority
            fill
            style={{ objectFit: "contain" }}
         />
      </div>
   );
};

export default ItemIcon;