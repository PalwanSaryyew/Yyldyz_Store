"use client";
import { webApp } from "@/lib/webApp";
import { useCartItem, useHandleModal, useQuantity, useUser } from "@/utils/UniStore";
import { beginCell, toNano } from "@ton/ton";
import {
   SendTransactionRequest,
   useTonAddress,
   useTonConnectUI,
} from "@tonconnect/ui-react";
import { ourTonAddress } from "bot/src/settings";
import { useState } from "react";

const Transactions = () => {
   const [tonConnectUI] = useTonConnectUI();
   const rawAddress = useTonAddress(false);
   const item = useCartItem((state) => state.item);
   const user = useUser((state) => state.user);
   const toogleModal = useHandleModal((state) => state.toogleOpen);
   const [isLoading, setIsLoading] = useState(false);
   const quantity = useQuantity((state) => state.quantity);

   async function handleClick() {
      setIsLoading(true);
      const app = await webApp();
      try {
         const response = await fetch(
            `/api/order?pid=${item?.id}&bid=${user?.id}&bsrnm=${user?.username}&rsrnm=${item?.receiver[1]}&crrnc=${item?.currency}&qty=${quantity}`
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
                     address: ourTonAddress, 
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
                     app.openTelegramLink("https://t.me/yyldyzbot");
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
