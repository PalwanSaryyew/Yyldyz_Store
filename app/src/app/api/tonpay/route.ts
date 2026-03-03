import { NextRequest, NextResponse } from "next/server";
import { verifyTonPayment } from "@/lib/tonVerifier";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const oid = searchParams.get("oid");

   if (!oid || isNaN(Number(oid))) {
      console.error("Order ID (oid) is missing or invalid.");
      return NextResponse.json(
         {
            success: false,
            message: "Wrong request: Order ID (oid) is missing or invalid.",
         },
         { status: 400 },
      );
   }

   const orderId = Number(oid);
   const success = await verifyTonPayment(orderId);
   return NextResponse.json({ success });
}
