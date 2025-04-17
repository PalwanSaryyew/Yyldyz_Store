/* import { LuAlignRight } from "react-icons/lu"; */
import Pricer from "../../utils/pricer";
import Image from "next/image";
const Header = () => {
   return (
      <header className="z-10 bg-blue-400 flex justify-between items-center px-4 py-1 rounded-b-3xl sticky top-0">
         {/* left */}
         <h1 className="flex items-center gap-1">
            <Image className="" alt="logo" src={'/logo/logo-corp-tiny.png'} width={40} height={40} />
            <span className="text-white font-bold">Ýyldyz Store</span>
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
      </header>
   );
};

export default Header;
