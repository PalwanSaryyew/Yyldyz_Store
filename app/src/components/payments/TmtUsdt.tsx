import { webApp } from "@/lib/webApp";
import { cn } from "@/utils/tailwindMerge";
import { CartItemState, useHandleModal, useUser } from "@/utils/UniStore";

const TmtUsdt = ({
   item,
   currency,
}: {
   item: CartItemState["item"];
   currency: string;
}) => {
   const changeLodingState = useHandleModal((state) => state.toogleLoading);
   const loading = useHandleModal((state) => state.isLoading);
   const tmtClass = cn(
      loading ? `bg-tmtColor/50 cursor-wait` : `bg-tmtColor`,
      `ring-orange-700`
   );
   const usdtClass = cn(
      loading ? `bg-usdtColor/50 cursor-wait` : `bg-usdtColor`,
      `ring-green-700`
   );
   const user = useUser((state) => state.user);
   const toogleModal = useHandleModal((state) => state.toogleOpen);

   async function handleClick() {
      //set loadind true
      changeLodingState();
      const app = await webApp();
      app.requestWriteAccess(async (perm) => {
         if (perm) {
            await fetch(
               `/api/order?pid=${item?.id}&bid=${user?.id}&bsrnm=${user?.username}&rsrnm=${item?.receiver}&crrnc=${item?.currency}`
            )
               .then(async (response) => await response.json())
               .then(async (data) => {
                  if (data.success) {
                     app.showAlert("Sargydy tassyklaň", () => {
                        app.openTelegramLink(
                           "https://t.me/officialstarstorebot"
                        );
                        app.close();
                     });
                  } else {
                     if (data.funds) {
                        changeLodingState();
                        toogleModal(2);
                     } else {
                        changeLodingState();
                        toogleModal(0);
                     }
                     app.showAlert(data.message);
                  }
               })
               .catch((e) => {
                  console.log(e);
                  app.showAlert("Yalnyslyk doredi");
                  changeLodingState();
                  toogleModal(0);
               });
         } else {
            changeLodingState();
            toogleModal(0);
         }
      });
   }
   return (
      <button
         disabled={loading}
         onClick={handleClick}
         className={cn(
            "ring-inherit ring-2 w-full py-2 text-white rounded-lg flex items-center justify-center ",
            currency === "TMT" ? tmtClass : usdtClass
         )}
      >
         {loading ? "Garaşyň..." : "Sarga"}
      </button>
   );
};

export default TmtUsdt;
