"use client";
import { ourTonAddress } from "@/lib/settings";
import { webApp } from "@/lib/webApp";
import { useCartItem, useHandleModal, useUser } from "@/utils/UniStore";
import { beginCell, toNano } from "@ton/ton";
import {
   SendTransactionRequest,
   useTonAddress,
   useTonConnectUI,
} from "@tonconnect/ui-react";
import { useState } from "react";

const Transactions = () => {
   const [tonConnectUI] = useTonConnectUI();
   const rawAddress = useTonAddress(false);
   const item = useCartItem((state) => state.item);
   const user = useUser((state) => state.user);
   const toogleModal = useHandleModal((state) => state.toogleOpen);
   const [isLoading, setIsLoading] = useState(false);

   async function handleClick() {
      setIsLoading(true);
      const app = await webApp();
      try {
         const response = await fetch(
            `/api/order?pid=${item?.id}&bid=${user?.id}&bsrnm=${user?.username}&rsrnm=${item?.receiver}&crrnc=${item?.currency}`
         ).then(async (response) => await response.json());

         if (response.success && response.tonComment) {
            // preparing transaction
            const body = beginCell()
               .storeUint(0, 32)
               .storeStringTail(response.tonComment)
               .endCell();
            const transaction: SendTransactionRequest = {
               validUntil: Date.now() + 15 * 60 * 1000, // 15min
               messages: [
                  {
                     address: ourTonAddress, // Use receiver address
                     amount: toNano(response.price).toString(),
                     payload: body.toBoc().toString("base64"),
                  },
               ],
            };
            async function sendTran(
               tonConnectUI: ReturnType<typeof useTonConnectUI>[0]
            ) {
               try {
                  await tonConnectUI.sendTransaction(transaction);
                  fetch(`/api/tonpay?oid=${response.orderId}`);
                  app.showAlert("Töleg amala aşyryldy! Sargydyňyz mümkin bolan iň gysga wagtda gowşurylar.", () => {
                     app.openTelegramLink("https://t.me/officialstarstorebot");
                  }); // Success message
               } catch (transactionError: unknown) {
                  console.log(transactionError);
                  app.showAlert("Tölegde ýalňyşlyk ýüze çykdy");
               }
            }

            await sendTran(tonConnectUI); // Use await here
         } else {
            app.showAlert(
               response.message
                  ? response.message
                  : "Yalnyslyk doredi tazeden synansyn"
            );
         }
      } catch (error) {
         app.showAlert("fetching error " + error); // Display error message to the user
      } finally {
         toogleModal(0);
         setIsLoading(false);
      }
   }

   return (
      <button
         disabled={isLoading}
         onClick={() => {
            if (rawAddress) {
               handleClick();
            } else if (!rawAddress) {
               tonConnectUI.openModal();
            } else {
            }
         }}
         className={`${
            isLoading ? "bg-tonColor/50 cursor-wait" : "bg-tonColor"
         } w-full py-2 text-white rounded-lg ring-inherit ring-2 ring-blue-800 flex items-center justify-center`}
      >
         {!rawAddress
            ? "TON bagla"
            : isLoading
            ? "Loading..."
            : "TON töle"}
      </button>
   );
};

export default Transactions;
