"use client";

import { useWhicIsOpen } from "@/utils/UniStore";
import React from "react";

const ItemModalOpener = ({
   id,
   children,
   style,
}: {
   id: number;
   children: React.ReactNode;
   style: string;
}) => {
   const chIsOpen = useWhicIsOpen((state) => state.change);
   const isOpen = useWhicIsOpen((state) => state.opened);
   return (
      <div
         className={style}
         onClick={() => {
            chIsOpen(isOpen === id ? 0 : id);
         }}
      >
         {children}
      </div>
   );
};

export default ItemModalOpener;
