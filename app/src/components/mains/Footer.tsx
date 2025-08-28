import { TiPlus } from "react-icons/ti";

import SumBox from "../sum/sumBox";
import User from "../telegram/User";
import WallConnHandler from "../ton/WallConnHandler";
import ModalOpener from "../modals/modalDinam/ModalOpener";

const Footer = () => {
   return (
      <footer className="fixed bottom-0 bg-gradient-to-t from-blue-400 via-blue-400/70 to-transparent w-full flex justify-between py-3 px-4 rounded-t-3xl">
         <div className="flex items-center justify-center">
            <ModalOpener
               style="text-white font-bold rounded-sm flex items-center gap-1 border-white cursor-pointer"
               modalNumber={2}
            >
               <User />
               <SumBox />
            </ModalOpener>
            <ModalOpener
               modalNumber={4}
               style="backdrop-blur-sm bg-black/20 rounded-full p-1 -ml-12 border-white border-2"
            >
               <TiPlus size={15} color="white" />
            </ModalOpener>
         </div>

         <WallConnHandler />
      </footer>
   );
};

export default Footer;
