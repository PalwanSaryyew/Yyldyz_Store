import TopupType from "./modalItems/TopupType";
import TopUpButton from "./modalItems/TopUpButton";

const BalansModal = () => {
   return (
      <div className="bg-stone-900/50 backdrop-blur-sm w-10/12 max-h-screen p-4 border border-mainColor rounded-lg overflow-auto">
         <div className="text-white text-sm">Balans doldurmagyň usullary</div>
         <div className="text-white text-sm mt-2 flex flex-col divide-y ">
            <TopupType fee={10}>TMCELL</TopupType>
            <TopupType fee={2}>Bank</TopupType>
            <TopupType fee={1}>Bankomat (kartdan karta)</TopupType>
            <TopupType fee={0}>USDT</TopupType>
            <TopupType fee={0}>Nagt</TopupType>
         </div>
         <TopUpButton/>
      </div>
   );
};

export default BalansModal;
