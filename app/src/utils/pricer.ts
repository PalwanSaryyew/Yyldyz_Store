import { cmcApi } from "@/lib/fetchs";
import { toncoinId } from "@/lib/settings";

const Pricer = async ({ round }: { round: number }) => {
   const res = await cmcApi(toncoinId);
   if (!res) {
      return 0;
   } // Use the variable in fetch

   /* {Math.round(price * 100) / 100} */

   return res.toFixed(round);
};

export default Pricer;
