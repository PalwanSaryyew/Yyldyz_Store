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
      name: Product["name"];
      amount: number;
      receiver: string;
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
   currency: "TMT" | "USDT" | "TON";
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
      username: string;
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
/* interface SummState {
   summ: {
      nmbr: string;
      usdt: number;
      tmt: number;
   } | null;
   add: (item: SummState["summ"]) => void;
}
export const useSumm = create<SummState>((set) => ({
   summ: null,
   add: (summ: SummState["summ"]) => set(() => ({ summ: summ })),
})); */
