const cmcApikey = process.env.CMC_API_KEY || "";

export async function cmcApi(id: number) {
   const fetchUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`;
   try {
      const response = await fetch(fetchUrl, {
         headers: {
            "X-CMC_PRO_API_KEY": cmcApikey,
         },
         cache: "no-cache",
      });
      const result = await response.json();
      const coinData = result.data;
      const coinId = Object.keys(coinData)[0]; // get key
      const coinPrice = coinData[coinId].quote.USD.price; // get price

      return Number(coinPrice);
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
