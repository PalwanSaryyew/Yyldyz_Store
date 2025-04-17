"use client";
import { usePathname } from "next/navigation";
interface ItemAmountProps {
   amount: number;
}

const ItemAmount = ({ amount }: ItemAmountProps) => {
   const currentPath = usePathname();

   return <>{currentPath === "/prem" ? amount + " aý" : amount}</>;
};

export default ItemAmount;
