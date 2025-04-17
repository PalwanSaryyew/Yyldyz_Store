"use client";
import { useTonAddress } from "@tonconnect/ui-react";

const WallAddress = () => {
   const userFriendlyAddress = useTonAddress();

   return userFriendlyAddress;
};

export default WallAddress;
