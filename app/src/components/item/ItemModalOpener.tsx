"use client";

import { useWhicIsOpen } from "@/utils/UniStore";
import React from "react";

const ItemModalOpener = ({
   id,
   children,
}: {
   id: number;
   children: React.ReactNode;
}) => {
   const chIsOpen = useWhicIsOpen((state) => state.change);
   const isOpen = useWhicIsOpen((state) => state.opened);
   return (
      <div
         className="bg-white cursor-pointer flex w-[90%] rounded-t-lg p-2 items-center justify-between mx-auto"
         onClick={() => {
            chIsOpen(isOpen === id ? 0 : id);
         }}
      >
         {children}
      </div>
   );
};

export default ItemModalOpener;
