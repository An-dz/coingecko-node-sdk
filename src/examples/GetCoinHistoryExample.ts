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

	const historicalData = await client.coins.history({
		coin_id: "bitcoin",
		date: "30-12-2017", // Format: dd-mm-yyyy
		localization: false, // Optional, defaults to true
	});

	console.log(historicalData);
})();

