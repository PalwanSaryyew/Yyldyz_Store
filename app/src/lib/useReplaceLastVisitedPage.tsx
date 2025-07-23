// app/page.js
"use client"; // Yönlendirme ve localStorage erişimi client-side olmalı
import { useRouter } from "next/navigation";
import { ProductType } from "../../prisma/prismaSett";
import { useEffect } from "react";
import { paths } from "bot/src/settings";

const ALLOWED_PATHS = paths; // Takip edilen sayfalar (hook'daki ile aynı olmalı)
const STORAGE_KEY = "lastVisitedPage"; // Yerel depo anahtarı (hook'daki ile aynı olmalı)

export default function useReplaceLastVisitedPage() {
   const router = useRouter();

   useEffect(() => {
      let lastVisited = null;
      try {
         // Yerel depodan son ziyaret edilen sayfayı oku
         lastVisited = localStorage.getItem(STORAGE_KEY);
      } catch (error) {
         console.error(
            "Failed to read last visited page from localStorage:",
            error
         );
         // Hata durumunda yönlendirme yapma
         return;
      }

      // Eğer bir değer varsa VE bu değer izin verilen yollardan biriyse
      if (lastVisited && ALLOWED_PATHS.includes(lastVisited as ProductType)) {
         console.log(`Redirecting to last visited page: ${lastVisited}`); // Konsolda kontrol
         // Kullanıcıyı son ziyaret ettiği sayfaya yönlendir
         router.replace(lastVisited);
         // replace kullanmak, tarayıcı geçmişinde ana sayfayı gereksiz yere tutmaz
      } else {
         console.log("No valid last visited page found. Staying on home page."); // Konsolda kontrol
         router.replace('/star');
         // İsterseniz burada varsayılan bir sayfaya yönlendirme de ekleyebilirsiniz.
      }
   }, [router]); // router nesnesi değişmeyeceği için bu effect genellikle sadece bir kere çalışır

   // Yönlendirme gerçekleşene kadar veya hiç yönlendirme olmayacaksa gösterilecek içerik.
   // Yönlendirme hızlı olacağı için buraya bir yükleniyor göstergesi koyabilirsiniz.
   return (
      <div>
         <h1>Ana Sayfa</h1>
         <p>Yönlendiriliyorsunuz...</p>
         {/* Ya da isterseniz ana sayfa içeriğini burada tutmaya devam edebilirsiniz.
          Eğer yönlendirme olmazsa bu içerik görünür. */}
      </div>
   );
}
