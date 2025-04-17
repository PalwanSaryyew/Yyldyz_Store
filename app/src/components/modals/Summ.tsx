"use client";

//import { webApp } from "@/lib/webApp";
import { cn } from "@/utils/tailwindMerge";
import { useHandleModal, useUser } from "@/utils/UniStore";
import Image from "next/image";

const Summ = () => {
   const isOpen = useHandleModal((state) => state.isOpen);
   // const close = useHandleModal((state) => state.toogleOpen);
   const user = useUser((state) => state.user);

   return (
      <div
         className={cn(
            isOpen === 2 ? "block" : "hidden",
            "w-[80%] fixed bg-slate-300 rounded-2xl flex flex-col py-2"
         )}
      >
         <div className="border-b border-slate-100 flex items-center justify-between mb-2 px-3 pb-1">
            <div className="flex items-center gap-1">
               <Image
                  alt=""
                  src={user?.photo_url || "/oth/no-user.png"}
                  width={40}
                  height={40}
                  className="rounded-full"
               />
               <div className="text-tgColor font-semibold">
                  {user?.name || "name"}
               </div>
            </div>
            <div>Hasap:</div>
         </div>
         <div className="rounded-md overflow-hidden mx-2">
            <div className="bg-slate-100 p-1 even:bg-gray-200 flex justify-between">
               <div>Belgi:</div>
               <div>{user?.nmbr}</div>
            </div>
            <div className="bg-slate-100 p-1 even:bg-gray-200 flex justify-between">
               <div>TMT:</div>
               <div>{user?.tmt}</div>
            </div>
            <div className="bg-slate-100 p-1 even:bg-gray-200 flex justify-between">
               <div>USDT:</div>
               <div>{user?.usdt}</div>
            </div>
         </div>
         <div className="w-full px-2 pt-2">
            {/* <button
               className="ring-inherit border-2 w-full py-2 bg-mainColor text-white rounded-lg flex items-center justify-center "
               onClick={async () => {
                  const app = await webApp();
                  app.openTelegramLink("https://t.me/starStoreChat/26");
                  close(0);
               }}
            >
               Hasaby Doldur
            </button> */}
         </div>
      </div>
   );
};

export default Summ;
