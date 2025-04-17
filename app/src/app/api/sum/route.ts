import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaSett";

export async function GET(request: Request): Promise<NextResponse> {
   const { searchParams } = new URL(request.url);
   const uId = searchParams.get("uid");
   if (!uId) {
      return NextResponse.json({ success: false, message: "wrong request" });
   }

   const user = await prisma.user.findUnique({
      where: {
         id: uId,
      },
   });

   if (user) {
      return NextResponse.json({
         success: true,
         sum: { tmt: user.sumTmt, usdt: user.sumUsdt, nmbr: user.walNum },
      });
   }
   return NextResponse.json({ success: false, message: "user not found" });
}
