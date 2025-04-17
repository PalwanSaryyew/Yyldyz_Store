import Image from "next/image";

export default function Loading() {
   // Or a custom loading skeleton component
   return (
      <div className="text-white flex items-center justify-center h-[75vh] text-lg">
         {/* <div className="w-24 h-24 border-4 border-t-orange-600 border-b-green-600 border-r-blue-600 border-white rounded-full animate-spin"></div> */}

         <Image
            src={"/svg/star.svg"}
            width={75}
            height={75}
            alt="Loading"
            className="animate-ping"
            rel="preload"
            priority 
         />

         {/* <div className="scale-150">
            <div className="loader"></div>
         </div> */}
      </div>
   );
}
