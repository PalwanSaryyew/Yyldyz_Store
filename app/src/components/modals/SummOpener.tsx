"use client";
import { useHandleModal } from "@/utils/UniStore";
import { ReactNode } from "react";

const SummOpener = ({ children }: { children: ReactNode }) => {
   const modalOpener = useHandleModal((state) => state.toogleOpen);
   function Open() {
      modalOpener(2);
   }
   return (
      <div
         className="text-white  font-bold rounded-sm flex items-center gap-1 border-white cursor-pointer"
         onClick={Open}
      >
         {children}
      </div>
   );
};

export default SummOpener;
