export async function cmcApi(id: string) {
   try {
     const data = await fetch(
       /* `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`, */
       `https://api.binance.com/api/v3/ticker/price?symbol=${id}`,
       { cache: 'no-store' } // Buraya cache: 'no-store' seçeneğini ekliyoruz
     )
     .then((response) => response.json())
     .then((data) => data.price);
     return Number(data);
   } catch (error: unknown) {
     console.log((error as Error).message);
     return 0;
   }
 }
export async function getUser(usrnm: string) {
   const res = await fetch("/api/username?usrnm=" + usrnm);
   const data = await res.json();
   return data;
}
