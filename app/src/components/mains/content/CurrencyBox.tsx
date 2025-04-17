import Image from "next/image";
import CrrncyChngr from "./CrrncyChngr";

const CurrencyBox = () => {
   return (
      <div className="cursor-pointer  text-white  font-bold mt-8 m-auto w-[90%]">
         <div className="w-[98%] rounded-t-3xl flex overflow-hidden">
            <CrrncyChngr crrncy="TMT">TMT</CrrncyChngr>
            <CrrncyChngr crrncy="USDT">
               <Image className="rounded-full border-[2px] border-white" src={"/crrnc/usdt.png"} alt="" width={30} height={30} />
            </CrrncyChngr>
            <CrrncyChngr crrncy="TON">
               <Image className="rounded-full border-[2px] border-white" src={"/crrnc/ton.png"} alt="" width={30} height={30} />
            </CrrncyChngr>
         </div>
      </div>
   );
};

export default CurrencyBox;
