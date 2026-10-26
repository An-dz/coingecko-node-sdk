import { z } from "zod";

export const coinsSchema = z.array(
	z.object({
		id: z.string(),
		symbol: z.string(),
		name: z.string(),
		platforms: z.record(z.string(), z.string().nullable()).optional(),
	}),
);

export const coinMarketSchema = z.object({
	id: z.string(),
	symbol: z.string(),
	name: z.string(),
	image: z.string(),
	current_price: z.string().nullable(),
	market_cap: z.string().nullable(),
	market_cap_rank: z.string().nullable(),
	fully_diluted_valuation: z.string().nullable(),
	total_volume: z.string().nullable(),
	high_24h: z.string().nullable(),
	low_24h: z.string().nullable(),
	price_change_24h: z.string().nullable(),
	price_change_percentage_24h: z.string().nullable(),
	market_cap_change_24h: z.string().nullable(),
	market_cap_change_percentage_24h: z.string().nullable(),
	circulating_supply: z.string().nullable(),
	total_supply: z.string().nullable(),
	max_supply: z.string().nullable(),
	ath: z.string().nullable(),
	ath_change_percentage: z.string().nullable(),
	ath_date: z.coerce.date().nullable(),
	atl: z.string().nullable(),
	atl_change_percentage: z.string().nullable(),
	atl_date: z.coerce.date().nullable(),
	roi: z
		.object({
			times: z.string().nullable(),
			currency: z.string().nullable(),
			percentage: z.string().nullable(),
		})
		.nullable(),
	last_updated: z.coerce.date().nullable(),
	sparkline_in_7d: z
		.object({
			price: z.array(z.string()),
		})
		.transform((v) => ({ price: v.price.map(Number) }))
		.nullish(),
	price_change_percentage_14d_in_currency: z.string().nullish(),
	price_change_percentage_1h_in_currency: z.string().nullish(),
	price_change_percentage_1y_in_currency: z.string().nullish(),
	price_change_percentage_200d_in_currency: z.string().nullish(),
	price_change_percentage_24h_in_currency: z.string().nullish(),
	price_change_percentage_30d_in_currency: z.string().nullish(),
	price_change_percentage_7d_in_currency: z.string().nullish(),
});

export const coinMarketsSchema = z.array(coinMarketSchema);

// Please, don't judge me on this 👍, I couldn't find any other way
export const tickersSchema = z.object({
	name: z.string(),
	tickers: z.array(
		z.object({
			base: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			target: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			market: z
				.object({
					name: z
						.string()
						.nullish()
						.transform((v) => v ?? null)
						.nullable(),
					identifier: z
						.string()
						.nullish()
						.transform((v) => v ?? null)
						.nullable(),
					has_trading_incentive: z
						.boolean()
						.nullish()
						.transform((v) => v ?? null)
						.nullable(),
					logo: z
						.string()
						.nullish()
						.transform((v) => v ?? null)
						.nullable(),
				})
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			last: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			volume: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			cost_to_move_up_usd: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			cost_to_move_down_usd: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			converted_last: z
				.object({
					btc: z
						.string()
						.nullish()
						.transform((v) => v ?? null)
						.nullable(),
					eth: z
						.string()
						.nullish()
						.transform((v) => v ?? null)
						.nullable(),
					usd: z
						.string()
						.nullish()
						.transform((v) => v ?? null)
						.nullable(),
				})
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			converted_volume: z.object({
				btc: z
					.string()
					.nullish()
					.transform((v) => v ?? null)
					.nullable(),
				eth: z
					.string()
					.nullish()
					.transform((v) => v ?? null)
					.nullable(),
				usd: z
					.string()
					.nullish()
					.transform((v) => v ?? null)
					.nullable(),
			}),
			trust_score: z
				.enum(["green", "yellow", "red", "gray"])
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			bid_ask_spread_percentage: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			timestamp: z.coerce
				.date()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			last_traded_at: z.coerce
				.date()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			last_fetch_at: z.coerce
				.date()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			is_anomaly: z
				.boolean()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			is_stale: z
				.boolean()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			trade_url: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			token_info_url: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			coin_id: z
				.string()
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
			target_coin_id: z
				.string()
				.transform((v) => v ?? null)
				.nullish()
				.transform((v) => v ?? null)
				.nullable(),
		}),
	),
});

export const marketChartSchema = z.object({
	prices: z.array(z.tuple([z.string(), z.string().nullable()])),
	market_caps: z.array(z.tuple([z.string(), z.string().nullable()])),
	total_volumes: z.array(z.tuple([z.string(), z.string().nullable()])),
});

export const tokenPriceSchema = z.record(
	z.string(),
	z.object({
		btc: z.string().optional(),
		eth: z.string().optional(),
		ltc: z.string().optional(),
		bch: z.string().optional(),
		bnb: z.string().optional(),
		eos: z.string().optional(),
		xrp: z.string().optional(),
		xlm: z.string().optional(),
		link: z.string().optional(),
		dot: z.string().optional(),
		yfi: z.string().optional(),
		usd: z.string().optional(),
		aed: z.string().optional(),
		ars: z.string().optional(),
		aud: z.string().optional(),
		bdt: z.string().optional(),
		bhd: z.string().optional(),
		bmd: z.string().optional(),
		brl: z.string().optional(),
		cad: z.string().optional(),
		chf: z.string().optional(),
		clp: z.string().optional(),
		cny: z.string().optional(),
		czk: z.string().optional(),
		dkk: z.string().optional(),
		eur: z.string().optional(),
		gbp: z.string().optional(),
		gel: z.string().optional(),
		hkd: z.string().optional(),
		huf: z.string().optional(),
		idr: z.string().optional(),
		ils: z.string().optional(),
		inr: z.string().optional(),
		jpy: z.string().optional(),
		krw: z.string().optional(),
		kwd: z.string().optional(),
		lkr: z.string().optional(),
		mmk: z.string().optional(),
		mxn: z.string().optional(),
		myr: z.string().optional(),
		ngn: z.string().optional(),
		nok: z.string().optional(),
		nzd: z.string().optional(),
		php: z.string().optional(),
		pkr: z.string().optional(),
		pln: z.string().optional(),
		rub: z.string().optional(),
		sar: z.string().optional(),
		sek: z.string().optional(),
		sgd: z.string().optional(),
		thb: z.string().optional(),
		try: z.string().optional(),
		twd: z.string().optional(),
		uah: z.string().optional(),
		vef: z.string().optional(),
		vnd: z.string().optional(),
		zar: z.string().optional(),
		xdr: z.string().optional(),
		xag: z.string().optional(),
		xau: z.string().optional(),
		bits: z.string().optional(),
		sats: z.string().optional(),
	}),
);
