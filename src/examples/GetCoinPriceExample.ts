import { GeckoClient } from "./../clients/GeckoClient.js";

declare const process: {
	env: Record<string, string | undefined>;
};

(async () => {
	const client = new GeckoClient({
		baseURL: "https://pro-api.coingecko.com/api/v3/",
		extraHTTPOptions: {
			headers: {
				"x-cg-pro-api-key": process.env.COINGECKO_API_KEY as string,
			},
		},
	});

	const price = await client.coins.price({
		chain: "ethereum",
		token_addresses: [
			"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
			"0xdac17f958d2ee523a2206206994597c13d831ec7",
		],
	});

	console.log(price);
})();
