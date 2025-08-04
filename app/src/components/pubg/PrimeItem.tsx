import { cn } from "@/utils/tailwindMerge";
import Image from "next/image";

type PrimeItemProps = {
   text: string;
   image: string;
   lightText: boolean;
};

const PrimeItem = ({ text, image, lightText }: PrimeItemProps) => {
   return (
      <div
         className={cn(
            lightText ? "text-gray-300" : "text-gray-600",
            "flex items-center gap-1 text-xs  font-medium"
         )}
      >
         <div className="w-5 h-5 relative">
            <Image
               src={image}
               alt={image}
               fill
               rel="preload"
               priority
               style={{ objectFit: "contain" }}
            />
         </div>
         {text}
      </div>
   );
};

export default PrimeItem;
