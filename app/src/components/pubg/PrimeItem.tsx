import Image from "next/image";

type PrimeItemProps = {
   text: string;
   image: string;
};

const PrimeItem = ({ text, image }: PrimeItemProps) => {
   return (
      <div className="flex items-center gap-1 text-sm">
         {" "}
         <Image src={image} alt={image} width={30} height={30} /> {text}
      </div>
   );
};

export default PrimeItem;
