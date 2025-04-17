import React from "react";

interface WalletConnHandButtProps {
   title: string ;
   handlerFunc?: () => void;
   isDisabled?: boolean;
}
const WalletConnHandButt: React.FC<WalletConnHandButtProps> = ({
   title,
   handlerFunc,
   isDisabled,
}) => {
   return (
      <button
         className="bg-tonColor text-white p-1 px-2 font-bold rounded-3xl ring-2 text-sm ring-white"
         onClick={handlerFunc}
         disabled={isDisabled}
      >
         {title}
      </button>
   );
};

export default WalletConnHandButt;
