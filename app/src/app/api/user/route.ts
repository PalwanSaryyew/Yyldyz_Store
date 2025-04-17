import { prisma } from "../../../../prisma/prismaSett";

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const uId = searchParams.get("uid");
   if (!uId) {
      return Response.json({ success: false, message: "wrong request" });
   }

   const user = await prisma.user.findUnique({
      where: {
         id: uId,
      },
   });

   console.log(user);
   
   if (user) {
      return Response.json({ success: true, user: true });
   }
   return Response.json({ success: true, user: false });
}
