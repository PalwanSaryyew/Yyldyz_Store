import { prisma } from "../../../../prisma/prismaSett";
import { NextRequest, NextResponse } from "next/server";
import { noticeAdmins, sendMessages } from "bot/src/funcs";
import { ourTonAddress } from "bot/src/settings";

const apiKey = process.env.TON_API;
const MAX_RETRIES = 20;
const RETRY_INTERVAL_MS = 30 * 1000; // (30 se)

// Auxiliary function: To wait for the specified time
function sleep(ms: number): Promise<void> {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

// Auxiliary function: to check the transaction on TON Blockchain
async function checkTransactionOnChain(
   address: string,
   expectedId: string
): Promise<boolean> {
   if (!apiKey) {
      console.error("TON API Key is not configured.");
      return false;
   }
   if (!address) {
      console.error("Target TON address (ourTonAddress) is not configured.");
      return false;
   }
   if (!expectedId) {
      console.error("Expected Transaction ID to match is missing.");
      return false;
   }

   const trimmedExpectedId = expectedId.trim(); // Clean leading/trailing spaces
   if (!trimmedExpectedId) {
      console.error("Expected Transaction ID is empty after trimming.");
      return false;
   }

   const url = `https://tonapi.io/v2/blockchain/accounts/${address}/transactions?limit=10`;

   try {
      console.log(
         `Checking transactions for address: ${address}, looking for transactionID: ${trimmedExpectedId}`
      );
      const response = await fetch(url, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
         },
      });

      if (!response.ok) {
         const errorBody = await response.text();
         console.error(
            `TonAPI Error: ${response.status} ${response.statusText}`,
            errorBody
         );
         return false;
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.transactions)) {
         console.error("TonAPI returned invalid data structure:", data);
         return false;
      }

      console.log(`Fetched ${data.transactions.length} transactions.`);

      for (const tx of data.transactions) {
         let fullComment = "";
         if (tx.in_msg?.decoded_body?.text) {
            fullComment = tx.in_msg.decoded_body.text;
         } else if (tx.in_msg?.message) {
            // Some wallets/APIs may use different locations for the comment
            fullComment = tx.in_msg.message;
         }

         if (fullComment) {
            const trimmedFullComment = fullComment.trim(); // Clear entire comment too
            console.log(`Found transaction comment: "${trimmedFullComment}"`);

            // Check if the entire comment contains the expected ID
            if (trimmedFullComment.includes(trimmedExpectedId)) {
               console.log(
                  `MATCH FOUND! Expected ID "${trimmedExpectedId}" is included in the comment. Tx Hash: ${tx.hash}`
               );
               return true; // Match found
            }
         }
      }

      console.log(
         `No transaction comment found containing the ID "${trimmedExpectedId}" in the last 10 transactions.`
      );
      return false;
   } catch (error) {
      console.error(
         "Error fetching or processing transactions from TonAPI:",
         error
      );
      return false;
   }
}

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const oid = searchParams.get("oid");

   if (!oid || isNaN(Number(oid))) {
      // oid must be numeric
      console.error("Order ID (oid) is missing or invalid.");

      return NextResponse.json(
         {
            success: false,
            message: "Wrong request: Order ID (oid) is missing or invalid.",
         },
         { status: 400 }
      );
   }

   const orderId = Number(oid);

   // 1. Retrieve order and associated transaction information from database
   const order = await prisma.order.findUnique({
      where: {
         id: orderId,
      },
      include: {
         tonTransaction: true, // Include associated tonTransaction data
      },
   });

   if (!order) {
      console.error(`Order Not Found for ID: ${orderId}`);
      return NextResponse.json(
         {
            success: false,
            message: "404 Order Not Found.",
         },
         { status: 404 }
      );
   }

   // 2. Get the transactionID that should match
   const paymentIdToMatch = order.tonTransaction?.id;
   if (!paymentIdToMatch) {
      console.error(`Payment comment/ID not found for Order ID: ${orderId}`);
      return NextResponse.json(
         {
            success: false,
            message: "Payment identifier not found for this order.",
         },
         { status: 400 }
      );
   }

   console.log(
      `Verifying payment for Order ID: ${orderId}, expecting comment: "${paymentIdToMatch}"`
   );

   // 3. Verify the transaction on the Blockchain (with Retry mechanism)
   let retries = 0;
   while (retries < MAX_RETRIES) {
      const found = await checkTransactionOnChain(
         ourTonAddress,
         paymentIdToMatch
      );

      if (found) {
         // Match found!
         console.log(`Payment confirmed for Order ID: ${orderId}`);
         const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: "paid" },
            include: {
               tonTransaction: true,
               product: true,
            },
         });
         console.log("before notice");
         await noticeAdmins(updatedOrder);
         return NextResponse.json({ success: true });
      }

      // No matches found, wait before trying again
      retries++;
      if (retries < MAX_RETRIES) {
         console.log(
            `Attempt ${retries}/${MAX_RETRIES}: Match not found for Order ID ${orderId}. Retrying in ${
               RETRY_INTERVAL_MS / 1000
            } seconds...`
         );
         await sleep(RETRY_INTERVAL_MS);
      }
   }

   // 4. Maximum number of attempts reached and no matches found
   console.warn(
      `Payment verification failed for Order ID: ${orderId} after ${MAX_RETRIES} retries.`
   );

   await sendMessages(
      [order.userId],
      `Payment verification failed for order ${orderId} after ${MAX_RETRIES} retries.`
   );

   return NextResponse.json(
      {
         success: false,
         message: "Transaction confirmation timed out.",
      },
      { status: 408 }
   ); // 408 Request Timeout
}
