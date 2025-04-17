import { Order, OrderStatus, Product, User } from "@prisma/client";
import { prisma } from "../prisma/prismaSett";
import { err_1, err_2, err_3, err_4, err_5 } from "./errCodes";
import { adminidS, rndmNmrGnrtr } from "./settings";
 type errMess = {
   error: boolean;
   mssg: string;
};
interface ValidatorOrder extends Order {
    product: Product;
    user: User;
 }
// chat id controller
export function chatIdV(userID: number | undefined): errMess {
    if (!userID) {
       console.log(err_1.d);
       return {
          error: true,
          mssg: err_1.m,
       };
    }
    return {
       error: false,
       mssg: "",
    };
 }
 // find user
 export async function usrFnd(userID: string): Promise<User | errMess> {
    const user = await prisma.user.findUnique({
       where: { id: userID },
    });
 
    if (!user) {
       console.log(err_2.d);
       return {
          error: true,
          mssg: err_2.m,
       };
    }
    return user;
 }
 // creating a user
 export async function usrCrt(userID: number): Promise<User | errMess> {
    const randomNum = rndmNmrGnrtr(4);
    const generateNum = randomNum.toString() + userID.toString().slice(-4);
    const user = await prisma.user.create({
       data: { id: userID.toString(), walNum: generateNum },
    });
 
    if (!user) {
       console.log(err_2.d);
       return {
          error: true,
          mssg: err_2.m,
       };
    }
    return user;
 }
 // user validator function
 export async function userValid(
    userID: number | undefined,
    create?: boolean
 ): Promise<User | errMess> {
    // chat id validator
    const chatIdR = chatIdV(userID);
    if (chatIdR.error) {
       return chatIdR;
    }
    // find user
    const user = await usrFnd(userID?.toString() || "");
    if (create && "error" in user) {
       const newUser = await usrCrt(userID || 0);
       return newUser;
    }
    return user;
 }
 // admin id matcher
 export function isAdminId(userID: number | undefined): errMess {
    if (!userID || !adminidS.includes(userID.toString())) {
       console.log(err_3.d);
       return {
          error: true,
          mssg: err_3.m,
       };
    }
    return {
       error: false,
       mssg: err_3.m,
    };
 }
 // order validator
 export async function validator(
    orderId: number,
    oldSatus: OrderStatus[],
    newStatus: OrderStatus,
    curierId?: string
 ): Promise<ValidatorOrder | errMess> {
    // getting order
    const order = await prisma.order.findUnique({
       where: {
          id: orderId,
       },
    });
    // order validator
    if (!order) {
       console.log(err_4.d);
       return {
          error: true,
          mssg: err_4.m,
       };
    }
    // status validator
    if (!oldSatus.includes(order.status)) {
       return {
          error: true,
          mssg: `Sargyt eýýäm "${order.status}" ýagdaýda!`,
       };
    }
    // order status update
    const data = curierId
       ? {
            status: newStatus,
            courierid: curierId,
         }
       : {
            status: newStatus,
         };
    const updateOrdare = await prisma.order.update({
       where: {
          id: order.id,
       },
       data,
       include: {
          product: true,
          user: true,
       },
    });
    // updateOrdare db error
    if (!updateOrdare) {
       console.log(err_5.d);
       return {
          error: true,
          mssg: err_5.m,
       };
    }
    return updateOrdare;
 }
 // admin validator
 export function adminValid(userID: number | undefined): errMess {
    // chat id exist ?
    const chatExist = chatIdV(userID);
    if (chatExist?.error) {
       return chatExist;
    }
    // admin id matcher
    const isAdmin = isAdminId(userID);
 
    return isAdmin;
 }