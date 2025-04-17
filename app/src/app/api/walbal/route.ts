import { NextResponse } from "next/server";

async function getTonBalance(walletAddress: string) {
   // tonapi.io API endpoint'i
   const apiUrl = `https://tonapi.io/v2/accounts/${walletAddress}`;
   const apiKey = process.env.TON_API;
   try {
      console.log(`Adres için bakiye alınıyor: ${walletAddress}`);

      // API'ye GET isteği gönder
      const response = await fetch(apiUrl, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
         },
      });

      // Yanıtın başarılı olup olmadığını kontrol et (HTTP status 200-299)
      if (!response.ok) {
         // Başarısızsa, API'den gelen hata mesajını almayı dene
         let errorBody = "Bilinmeyen API Hatası";
         try {
            const errorData = await response.json();
            errorBody = errorData.error || JSON.stringify(errorData);
         } catch (e) {
            console.log(e);
            errorBody = response.statusText;
         }
         throw new Error(`API Hatası: ${response.status} - ${errorBody}`);
      }

      // Yanıtı JSON olarak parse et
      const data = await response.json();

      // 'balance' alanını kontrol et (nanoton cinsinden gelir)
      if (data && typeof data.balance !== "undefined") {
         const balanceInNanoTon = BigInt(data.balance); // Büyük sayılar için BigInt kullanmak daha güvenlidir
         const balanceInTon = Number(balanceInNanoTon) / 1_000_000_000; // 1 TON = 1,000,000,000 Nanoton
         console.log(`Bakiye (Nanoton): ${balanceInNanoTon}`);
         console.log(`Bakiye (TON): ${balanceInTon}`);
         return balanceInTon;
      } else {
         throw new Error(
            "Yanıt formatı beklenildiği gibi değil, 'balance' alanı bulunamadı."
         );
      }
   } catch (error) {
      console.error("Bakiye alınırken hata oluştu:", error);
      // Hata durumunda çağıran fonksiyona hatayı tekrar fırlat
      throw error;
   }
}

// Fonksiyonu çağır ve sonucu işle

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const adr = searchParams.get("adr");

   // --- Başlangıç Kontrolü Eklendi ---
   if (!adr || typeof adr !== "string" || adr.trim() === "") {
      return NextResponse.json(
         {
            success: false,
            message: "Missing or invalid 'adr' query parameter.",
         },
         { status: 400 } // Bad Request
      );
   }
   // --- Kontrol Sonu ---

   try {
      // Artık adr'ın null veya boş olmadığını biliyoruz
      const balance = await getTonBalance(adr);
      return NextResponse.json({
         success: true,
         balance: balance,
      });
   } catch (error) {
      // Hata tipini belirtmek iyi pratik
      // Hata loglama (sunucu tarafında)
      console.error(`Error fetching balance for ${adr}:`, error);

      // Hata tipini daralt
      const errorMessage =
         error instanceof Error ? error.message : "Unknown error";

      // İstemciye daha kontrollü bir hata mesajı gönder
      return NextResponse.json(
         {
            success: false,
            // error.message'ı göndermek bazen iç detayları sızdırabilir,
            // duruma göre sadece genel bir mesaj gönderebilirsiniz.
            message: `Failed to retrieve balance: ${errorMessage}`,
         },
         { status: 500 } // Internal Server Error veya API'den gelen hataya göre daha spesifik (örn. 404)
      );
   }
}
