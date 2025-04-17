import { cn } from "@/utils/tailwindMerge";
import { PaymentMethod } from "../../../prisma/prismaSett";

const Sum = ({ sum, crrncy }: { sum?: number; crrncy: PaymentMethod }) => {
   return (
      <div
         className={cn(
            crrncy === "TMT" ? "translate-x-4 pl-7" : "pl-6",
            "border-r border-y rounded-r-full pr-2 py-2 text-sm"
         )}
      >
         {sum ? sum : 0} {crrncy}
      </div>
   );
};

export default Sum;
