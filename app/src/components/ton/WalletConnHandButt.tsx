import { cn } from "@/utils/tailwindMerge";
import Image from "next/image";
import React from "react";

interface WalletConnHandButtProps {
   handlerFunc?: () => void;
   isDisabled?: boolean;
   children?: React.ReactNode;
   status?: "loading" | "connected" | "disconnected";
}
const WalletConnHandButt: React.FC<WalletConnHandButtProps> = ({
   children,
   handlerFunc,
   isDisabled,
   status,
}) => {
   return (
      <button
         className={cn(
            status === "disconnected" ? "p-0" : "p-1 px-2 ",
            "bg-tonColor text-whitefont-bold rounded-3xl text-sm text-white font-semibold ring-2 ring-gray-200 hover:ring-gray-300 active:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
         )}
         onClick={handlerFunc}
         disabled={isDisabled}
      >
         {status !== "disconnected" ? (
            children
         ) : (
            <Image
               alt="ton connect"
               src="/icons/wallet.png"
               width={40}
               height={40}
            />
         )}
      </button>
   );
};

export default WalletConnHandButt;
