import PercentageCalculator from "./summCalc";

const TopupType = ({
   children,
   fee,
}: {
   children: React.ReactNode;
   fee: number;
}) => {
   return (
      <div className="py-3">
         <div className="flex justify-between">
            <div className="border-l border-mainColor p-1 hover:bg-mainColor flex">
               {children}
            </div>
            <div className="border-b border-mainColor p-1">{fee}%</div>
         </div>
         <PercentageCalculator percentage={fee} />
      </div>
   );
};

export default TopupType;
