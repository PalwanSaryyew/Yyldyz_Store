import { Order, Product, User } from "../prisma/prismaSett";

export type errMess = {
   error: boolean;
   mssg: string;
};
export interface ValidatorOrder extends Order {
   Product: Product;
   User: User;
}