import { Detail, Details, DetailTitle } from "@prisma/client";
import PrimeItem from "./PrimeItem";
import { cn } from "@/utils/tailwindMerge";

interface PrimeItemsBoxProps {
   detail: (Details & { detail: Detail[]; title: DetailTitle | null }) | null;
   textLight: boolean;
}

const PrimeItemsBox = ({ detail, textLight }: PrimeItemsBoxProps) => {
   if (!detail ) {
      return null;
   }
   return (
      <div className="pb-2 pt-[0.2rem] border-t border-gray-300">
         <div
            className={cn(
               textLight ? "text-gray-200" : "text-gray-700",
               "text-sm font-semibold pb-[0.2rem]"
            )}
         >
            {detail.title?.text}
         </div>
         <div className="flex gap-4 flex-wrap">
            {detail.detail.map((item, index) => (
               <PrimeItem key={index} text={item.text} image={item.image}  lightText={textLight}/>
            ))}
         </div>
      </div>
   );
};

export default PrimeItemsBox;
