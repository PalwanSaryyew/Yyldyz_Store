"use client";

//import { useEffect, useState } from "react";
import { useUser } from "@/utils/UniStore";
import Sum from "./sum";

const SumBox = () => {
   const user = useUser((state) => state.user);
   /* const setSumm = useSumm((state) => state.add);
   interface SumType {
      tmt: number;
      usdt: number;
   }

   const [sum, setSum] = useState<SumType | null>(null);

   useEffect(() => {
      const getSum = async () => {
         const response = await fetch("/api/sum?uid=" + user?.id);
         const {
            usdt,
            tmt,
            nmbr,
         }: { usdt: number; tmt: number; nmbr: string } = await response.json();
         const sum = { usdt, tmt, nmbr };
         setSum(sum);
         setSumm({
            usdt: sum.usdt,
            tmt: sum.tmt,
            nmbr: sum.nmbr,
         });
      };

      getSum();
   }, [user?.id, setSumm]); */
   return (
      <div className="flex -translate-x-12">
         <Sum sum={user?.tmt } crrncy="TMT" />
         <Sum sum={user?.usdt} crrncy="USDT" />
      </div>
   );
};

export default SumBox;
