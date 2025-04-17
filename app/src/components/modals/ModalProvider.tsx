"use client";
import { useHandleModal } from "@/utils/UniStore";
import ChktMdl from "./ChktMdl";
import { cn } from "@/utils/tailwindMerge";
import Summ from "./Summ";

const ModalProvider = () => {
   const modalCloser = useHandleModal((state) => state.toogleOpen);
   const isLoading = useHandleModal((state) => state.isLoading);
   const isOpen = useHandleModal((state) => state.isOpen);

   return (
      <div
         className={cn(
            isOpen === 0 ? "hidden" : "flex",
            "bg-black/40 backdrop-blur-sm fixed w-full h-full  items-center justify-center z-50 "
         )}
      >
         {/* Closer */}
         <div
            className="w-[100%] h-[100%] fixed"
            onClick={() => {
               if (isLoading) {
                  return;
               } else {
                  modalCloser(0);
               }
            }}
         ></div>
         {isOpen === 1 ? <ChktMdl /> : <Summ />}
      </div>
   );
};

export default ModalProvider;
