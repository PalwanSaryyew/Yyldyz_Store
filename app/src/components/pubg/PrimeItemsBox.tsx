import PrimeItem from "./PrimeItem";

interface PrimeItemsBoxProps {
   detail: {
      title: string;
      details: { image: string; text: string }[];
   };
}

const PrimeItemsBox = ({ detail }: PrimeItemsBoxProps) => {
   return (
      <div className="pb-2 border-t">
         <div className="text-sm">{detail.title}</div>
         <div className="flex gap-4 flex-wrap">
            {detail.details.map((item, index) => (
               <PrimeItem key={index} text={item.text} image={item.image} />
            ))}
            
         </div>
      </div>
   );
};

export default PrimeItemsBox;
