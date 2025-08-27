import { Order, Product, User } from "../prisma/prismaSett";

export type errMess = {
   error: boolean;
   mssg: string;
};
export interface ValidatorOrder extends Order {
   product: Product;
   user: User;
}