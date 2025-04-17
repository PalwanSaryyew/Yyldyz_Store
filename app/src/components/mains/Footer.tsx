import SummOpener from "../modals/SummOpener";
import SumBox from "../sum/sumBox";
import User from "../telegram/User";
import WallConnHandler from "../ton/WallConnHandler";

const Footer = () => {
   return (
      <footer className="fixed bottom-0 bg-blue-400 w-full flex justify-between py-3 px-4 rounded-t-3xl">
         <SummOpener>
            <User />
            <SumBox />
         </SummOpener>

         <WallConnHandler />
      </footer>
   );
};

export default Footer;
