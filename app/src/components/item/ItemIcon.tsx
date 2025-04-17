"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
const ItemIcon = () => {
   const currentPath = usePathname();
   return (
      <Image
         src={`/jtns${currentPath}.png`}
         width={28}
         height={28}
         alt=""
         rel="preload"
         priority
      />
   );
};

export default ItemIcon;
