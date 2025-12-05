/* import { LuAlignRight } from "react-icons/lu"; */
import { RiMailVolumeFill } from "react-icons/ri";
import Pricer from "../../utils/pricer";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
   return (
      <header className="z-10 bg-blue-400 flex justify-between items-center px-4 py-1 rounded-b-3xl sticky top-0">
         {/* left */}
         <h1 className="flex items-center gap-1">
            <Image className="" alt="logo" src={'/logo/new-year.png'} width={40} height={40} />
            <span className="text-white font-bold"></span>
         </h1>
         {/* <h1 className="font-semibold cursor-pointer rounded-full p-[2px] bg-gradient-to-r from-orange-500 via-green-500 to-blue-500">
            <div className="bg-white rounded-full p-1 px-2">
               <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 bg-clip-text text-transparent text-lg">
                  Ýyldyz Store
               </span>
            </div>
         </h1> */}
         {/* mid */}
         <div className="text-white font-bold">
            TON: <Pricer round={2} />
         </div>
         {/* right */}
         {/* <div className="cursor-pointer">
            <LuAlignRight size={45} color="white" />
         </div> */}
         <Link href={'https://t.me/YyldyzKanal'} className="relative">
            <div className="rounded-full bg-red-600 p-1 absolute hidden"></div>
            <RiMailVolumeFill size={28} color="white"/>
         </Link>
      </header>
   );
};

export default Header;
