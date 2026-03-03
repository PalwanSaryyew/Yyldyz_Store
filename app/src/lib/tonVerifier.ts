import { prisma } from "../../prisma/prismaSett";
import { noticeAdmins, OrderDetails, sendMessages } from "bot/src/funcs";
import { ourTonAddress } from "bot/src/settings";

const apiKey = process.env.TON_API;
// configurable maximum number of verification loops per order; keep low to save CPU/IO
const MAX_RETRIES = Number(process.env.MAX_TON_RETRIES || 5);
const RETRY_INTERVAL_MS = 30 * 1000; // 30 seconds between normal retries
const RATE_LIMIT_BACKOFF_MS = 60 * 1000; // wait longer when we see 429

// simple throttle state, ensure at most one request every interval
let lastRequestTime = 0;
const REQUEST_INTERVAL = 500; // ~2 requests/sec

// helper that waits
function sleep(ms: number): Promise<void> {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

// simple throttler to avoid bursting TonAPI calls
async function throttle(): Promise<void> {
   const now = Date.now();
   const wait = REQUEST_INTERVAL - (now - lastRequestTime);
   if (wait > 0) {
      await sleep(wait);
   }
   lastRequestTime = Date.now();
}

// query chain for a transaction containing expected comment/id
async function checkTransactionOnChain(
   address: string,
   expectedId: string,
): Promise<string | false> {
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

   const trimmedExpectedId = expectedId.trim();
   if (!trimmedExpectedId) {
      console.error("Expected Transaction ID is empty after trimming.");
      return false;
   }

   const url = `https://tonapi.io/v2/blockchain/accounts/${address}/transactions?limit=10`;

   try {
      // throttle global requests to avoid rate limit
      await throttle();
      console.log(
         `Checking transactions for address: ${address}, looking for transactionID: ${trimmedExpectedId}`,
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
            errorBody,
         );
         if (response.status === 429) {
            // rate limit - throw so caller can back off more drastically
            const err = new Error("TON_RATE_LIMIT") as Error & {
               rateLimit: boolean;
            };
            err.rateLimit = true;
            throw err;
         }
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
            fullComment = tx.in_msg.message;
         }

         if (fullComment) {
            const trimmedFullComment = fullComment.trim();
            console.log(`Found transaction comment: "${trimmedFullComment}"`);

            if (trimmedFullComment.includes(trimmedExpectedId)) {
               console.log(
                  `MATCH FOUND! Expected ID "${trimmedExpectedId}" is included in the comment. Tx Hash: ${tx.hash}`,
               );
               return tx.hash;
            }
         }
      }

      console.log(
         `No transaction comment found containing the ID "${trimmedExpectedId}" in the last 10 transactions.`,
      );
      return false;
   } catch (error) {
      console.error(
         "Error fetching or processing transactions from TonAPI:",
         error,
      );
      return false;
   }
}

// verifies and updates order status; used by route and other callers
export async function verifyTonPayment(orderId: number): Promise<boolean> {
   const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { TonTransaction: true, Product: true },
   });

   if (!order) {
      console.error(`verifyTonPayment: order not found (${orderId})`);
      return false;
   }
   if (order.status === "paid") {
      console.log(`verifyTonPayment: order ${orderId} already paid, skipping`);
      return true;
   }

   const paymentIdToMatch = order.TonTransaction?.id;
   if (!paymentIdToMatch) {
      console.error(
         `verifyTonPayment: ton transaction id missing for order ${orderId}`,
      );
      return false;
   }

   console.log(
      `verifyTonPayment: checking order ${orderId} for comment ${paymentIdToMatch}`,
   );

   let retries = 0;
   while (retries < MAX_RETRIES) {
      // add random jitter to scatter concurrent verifications
      await sleep(Math.random() * 400);
      let txHash: string | false = false;
      try {
         txHash = await checkTransactionOnChain(
            ourTonAddress,
            paymentIdToMatch,
         );
      } catch (e: unknown) {
         const error = e as Error & { rateLimit?: boolean };
         if (error?.rateLimit) {
            console.warn(
               `verifyTonPayment: hit rate limit for order ${orderId}, backing off`,
            );
            await sleep(RATE_LIMIT_BACKOFF_MS);
            retries++;
            continue; // retry
         }
         console.error("verifyTonPayment: unexpected error", e);
      }

      if (txHash) {
         console.log(
            `verifyTonPayment: payment confirmed for order ${orderId}, hash ${txHash}`,
         );
         await prisma.order.update({
            where: { id: orderId },
            data: { status: "paid" },
         });
         await prisma.tonTransaction
            .update({ where: { orderId: orderId }, data: { txHash } })
            .catch(() => {});

         const paidOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { TonTransaction: true, Product: true },
         });
         if (paidOrder) {
            await noticeAdmins(paidOrder as OrderDetails);
         }
         return true;
      }

      retries++;
      if (retries < MAX_RETRIES) {
         console.log(
            `verifyTonPayment attempt ${retries}/${MAX_RETRIES} failed for order ${orderId}, sleeping...`,
         );
         await sleep(RETRY_INTERVAL_MS);
      }
   }

   if (retries >= MAX_RETRIES) {
      console.info(
         `verifyTonPayment: exhausted max retries (${MAX_RETRIES}) for order ${orderId}, stopping further checks`,
      );
   }

   console.warn(
      `verifyTonPayment: timed out waiting for TON payment for order ${orderId}`,
   );
   await sendMessages(
      [order.userId],
      `TON tölegiňiz sistemamyz tarapyndan ýüze çykarylmady. Eger balansyňyzdan pul alynan bolsa, admin bilen habarlaşyň. Sargyt ID: ${orderId}`,
   );
   return false;
}

// on startup, restart pending scans
let pendingScannerStarted = false;
async function resumePendingTonVerifications() {
   if (pendingScannerStarted) return;
   pendingScannerStarted = true;
   try {
      const pending = await prisma.order.findMany({
         where: { payment: "TON", status: "pending" },
      });
      for (const o of pending) {
         // process sequentially with small pause to avoid burst
         await verifyTonPayment(o.id).catch((e) =>
            console.error("resume verifyTonPayment error", e),
         );
         await sleep(REQUEST_INTERVAL);
      }
   } catch (e) {
      console.error("Failed to resume pending TON verifications", e);
   }
}
// kick it off
resumePendingTonVerifications();
