"use client";
import {
   useIsConnectionRestored,
   useTonAddress,
   useTonConnectUI,
} from "@tonconnect/ui-react";
import WalletConnHandButt from "./WalletConnHandButt";
import { useEffect, useState } from "react";


const WallConnHandler = () => {
   const [tonConnectUI /* setOptions */] = useTonConnectUI();
   const connectionRestored = useIsConnectionRestored();
   const rawAddress = useTonAddress(false);
   const userFriendlyAddress = useTonAddress();
   const [formattedAddress, setFormattedAddress] = useState<string>("");

   useEffect(() => {
      const formatAddress = async () => {
         if (!rawAddress) {
            setFormattedAddress("...");
            return;
         }
         const response = await fetch("/api/walbal?adr=" + userFriendlyAddress);
         const data: { balance: string; success: boolean } =
            await response.json();
         if (data.success) {
            setFormattedAddress(data.balance.toString().slice(0, 6) + " TON");
         } else {
            setFormattedAddress(
               `${userFriendlyAddress.slice(
                  0,
                  4
               )}...${userFriendlyAddress.slice(-4)}`
            );
         }
      };

      formatAddress();
   }, [rawAddress, userFriendlyAddress]);
   return (
      <>
         {!connectionRestored ? (
            <WalletConnHandButt isDisabled={true} status={"loading"}>
               ...
            </WalletConnHandButt>
         ) : rawAddress ? (
            <WalletConnHandButt
               handlerFunc={() => tonConnectUI.disconnect()}
               status={"connected"}
            >
               {formattedAddress}
            </WalletConnHandButt>
         ) : (
            <WalletConnHandButt
               handlerFunc={() => tonConnectUI.openModal()}
               status={"disconnected"}
            ></WalletConnHandButt>
         )}
      </>
   );
};

export default WallConnHandler;
