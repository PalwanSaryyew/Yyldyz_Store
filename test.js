const main = async () => {
    const data = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd')
        .then(response => response.json())
        .then(data => data['the-open-network'].usd);
    console.log(`The current price of TON in USD is: $${data}`);
}
main()