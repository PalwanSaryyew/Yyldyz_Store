import Image from "next/image";

type PrimeItemProps = {
   text: string;
   image: string;
};

const PrimeItem = ({ text, image }: PrimeItemProps) => {
   return (
      <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
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
