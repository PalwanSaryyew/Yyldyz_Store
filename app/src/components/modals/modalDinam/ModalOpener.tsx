"use client";

import { useHandleModal } from "@/utils/UniStore";

type Props = {
   children: React.ReactNode;
   modalNumber: number;
   style?: string;
};
const ModalOpener = ({ children, style, modalNumber }: Props) => {
   const modalOpener = useHandleModal((state) => state.toogleOpen);
   function Open() {
      modalOpener(modalNumber);
   }
   return (
      <div className={style} onClick={Open}>
         {children}
      </div>
   );
};

export default ModalOpener;
