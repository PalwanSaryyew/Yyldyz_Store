import { JSDOM } from "jsdom";

export async function GET(request: Request) {
   try {
      const { searchParams } = new URL(request.url);
      const username = searchParams.get("usrnm");
      if (!username) {
         return Response.json({ success: false, message: "wrong request" });
      }

      const response = await fetch("https://t.me/" + username);
      if (!response) {
         return Response.json({ success: false, message: "1) Telegram username ýalňyş!" });
      }
      const html = response.text();
      if (!html) {
         return Response.json({ success: false, message: "2) Telegram username ýalňyş!" });
      }

      const dom = new JSDOM(await html);
      const doc = dom.window.document;
      const ogImage = doc
         .querySelector('meta[property="og:image"]')
         ?.getAttribute("content");

      const pageTitleDiv = doc.querySelector(".tgme_page_title");
      const pageTitle = pageTitleDiv?.textContent;
      if (!pageTitle || !pageTitleDiv) {
         return Response.json({ success: false, message: "Telegram username ýalňyş!" });
      }

      return Response.json({
         success: true,
         id: 1235,
         photo_url: ogImage,
         name: pageTitle,
      });
   } catch (error) {
      console.log(error);
      return Response.json({ success: false, message: "server side error" });
   }
}
