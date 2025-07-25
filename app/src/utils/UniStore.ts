import { create } from "zustand";
import { PaymentMethod, Product } from "../../prisma/prismaSett";

interface ModalState {
   isOpen: number;
   isLoading: boolean;
   toogleOpen: (number: ModalState["isOpen"]) => void;
   toogleLoading: () => void;
}
export const useHandleModal = create<ModalState>((set) => ({
   isOpen: 0,
   isLoading: false,
   toogleOpen: (number: ModalState["isOpen"]) =>
      set(() => ({ isOpen: number })),
   toogleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
}));

export interface CartItemState {
   item: {
      id: number;
      name: Product["name"] | Product["title"];
      title: string | null;
      amount: number | null;
      duration: string | null;
      receiver: string[];
      currency: PaymentMethod;
      total: number;
   } | null;
   add: (item: CartItemState["item"]) => void;
}
export const useCartItem = create<CartItemState>((set) => ({
   item: null,
   add: (item: CartItemState["item"]) => set(() => ({ item: item })),
}));

interface CurrencyState {
   currency: PaymentMethod;
   change: (currency: CurrencyState["currency"]) => void;
}
export const useCurrency = create<CurrencyState>((set) => ({
   currency: "TMT",
   change: (currency) => set(() => ({ currency: currency })),
}));

interface WhichIsOpenState {
   opened: number;
   change: (indx: WhichIsOpenState["opened"]) => void;
}
export const useWhicIsOpen = create<WhichIsOpenState>((set) => ({
   opened: 0,
   change: (indx) => set(() => ({ opened: indx })),
}));

interface UserState {
   user: {
      id: number;
      username?: string;
      name: string;
      photo_url: string;
      nmbr: string;
      usdt: number;
      tmt: number;
   } | null;
   add: (item: UserState["user"]) => void;
}
export const useUser = create<UserState>((set) => ({
   user: null,
   add: (user: UserState["user"]) => set(() => ({ user: user })),
}));

interface ReceiverState {
   user: {
      name: string;
      photo_url: string;
   } | null;
   add: (item: ReceiverState["user"]) => void;
}
export const useReceiver = create<ReceiverState>((set) => ({
   user: null,
   add: (user: ReceiverState["user"]) => set(() => ({ user: user })),
}));

interface QuantityState {
   quantity: string;
   orgPriceTMT: number;
   orgPriceUSDT: number;
   change: (quantity: QuantityState["quantity"]) => void;
   changeTMT: (orgPriceTMT: QuantityState["orgPriceTMT"]) => void;
   changeUSDT: (orgPriceUSDT: QuantityState["orgPriceTMT"]) => void;
}
export const useQuantity = create<QuantityState>((set) => ({
   quantity: "",
   orgPriceTMT: 0,
   orgPriceUSDT: 0,
   change: (quantity: QuantityState["quantity"]) =>
      set(() => ({ quantity: quantity })),
   changeTMT: (orgPriceTMT: QuantityState["orgPriceTMT"]) =>
      set(() => ({ orgPriceTMT: orgPriceTMT })),
   changeUSDT: (orgPriceUSDT: QuantityState["orgPriceUSDT"]) =>
      set(() => ({ orgPriceUSDT: orgPriceUSDT })),
}));
