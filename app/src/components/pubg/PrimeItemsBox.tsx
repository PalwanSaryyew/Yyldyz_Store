import { Detail, Details, DetailTitle } from "@prisma/client";
import PrimeItem from "./PrimeItem";

interface PrimeItemsBoxProps {
   detail: (Details & { detail: Detail[]; title: DetailTitle | null }) | null;
}

const PrimeItemsBox = ({ detail }: PrimeItemsBoxProps) => {
   if (!detail || !detail.detail || detail.detail.length === 0) {
      return null;
   }
   return (
      <div className="pb-2 border-t border-gray-300">
         <div className="text-base">{detail.title?.text}</div>
         <div className="flex gap-4 flex-wrap">
            {detail.detail.map((item, index) => (
               <PrimeItem key={index} text={item.text} image={item.image} />
            ))}
         </div>
      </div>
   );
};

export default PrimeItemsBox;
