import ItemModal from "./ItemModal";
import ItemModalOpener from "./ItemModalOpener";
import ItemPrice from "./ItemPrice";
import ItemIcon from "./ItemIcon";
import ItemAmount from "./ItemAmount";
import { Product } from "../../../prisma/prismaSett";
interface ItemBoxProps {
   item: Product;
   tonPrice: number;
}

const ItemBox = ({ item, tonPrice }: ItemBoxProps) => {
   return (
      <div className="w-full">
         <ItemModalOpener id={item.id}>
            {/* left */}
            <div className="flex items-center gap-4">
               <div className="">
                  <ItemIcon />
               </div>
               <div className="text-[1.3rem] font-semibold text-gray-600">
                  <ItemAmount amount={item.amount} />
               </div>
            </div>

            {/* right */}

            <ItemPrice
               tonPrice={tonPrice}
               priceTMT={item.priceTMT}
               priceUSDT={item.priceUSDT}
            />
         </ItemModalOpener>

         {/* openable bottom section */}
         <ItemModal item={item} tonPrice={tonPrice} />
      </div>
   );
};

export default ItemBox;
