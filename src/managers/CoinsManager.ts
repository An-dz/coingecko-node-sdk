import { z } from "zod";
import { CoinNotFoundError } from "../errors/CoinNotFoundError.js";
import { HttpError } from "../errors/HttpError.js";
import { Coin } from "../structures/Coin.js";
import { CoinMarket } from "../structures/CoinMarket.js";
import { CoinPrice } from "../structures/CoinPrice.js";
import { Ticker } from "../structures/Ticker.js";
import { parseSchemaFromResponse } from "../utils/schemaparser.js";
import { BaseCoin } from "./../structures/BaseCoin.js";
import { GeckoRequestManager } from "./GeckoRequestManager.js";
import { CoinMarketMapper } from "./mappers/CoinMarketMapper.js";
import { MarketChartMapper } from "./mappers/MarketChartMapper.js";
import {
	coinMarketsSchema,
	coinsSchema,
	marketChartSchema,
	tickersSchema,
	tokenPriceSchema,
} from "./validators/CoinsManager.validator.js";

export type CoinsManagerProps = {
	requestManager: GeckoRequestManager;
};
export type Periods = "1h" | "24h" | "7d" | "14d" | "30d" | "200d" | "1y";

export type ListCoinsProps = {
	include?: {
		platform?: boolean;
	};
};

export type ListMarketsProps = {
	vs_currency: string;

	include?: {
		sparkline?: boolean;
		price_change_percentage: Periods[];
	};
	page?: number;
	per_page?: number;
};

export type GetTickersProps = {
	coin_id: string;
	include?: {
		depth?: boolean;
		include_exchange_logo?: boolean;
	};
};

export type GetCoinByIDProps = {
	coin_id: string;
	include?: {
		sparkline?: boolean;
		tickers?: boolean;
		market_data?: boolean;
		community_data?: boolean;
		developer_data?: boolean;
		localization?: boolean;
	};
};

export type GetCoinPriceByTokenAddressesProps = {
	token_addresses: string | string[];
	chain: string;
};

export type GetCoinMarketChartProps = {
	coin_id: string;
	vs_currency: string;
	days: string | number;
	interval?: string;
};

export type GetCoinHistoryProps = {
	coin_id: string;
	date: string; // Format: dd-mm-yyyy
	localization?: boolean;
};

export class CoinsManager {
	#request: GeckoRequestManager;

	constructor({ requestManager }: CoinsManagerProps) {
		this.#request = requestManager;
	}

	async price({ token_addresses, chain }: GetCoinPriceByTokenAddressesProps) {
		const params = new URLSearchParams();

		params.append(
			"contract_addresses",
			typeof token_addresses === "string"
				? token_addresses
				: token_addresses.join(","),
		);
		params.append(
			"vs_currencies",
			"btc,eth,ltc,bch,bnb,eos,xrp,xlm,link,dot,yfi,usd,aed,ars,aud,bdt,bhd,bmd,brl,cad,chf,clp,cny,czk,dkk,eur,gbp,gel,hkd,huf,idr,ils,inr,jpy,krw,kwd,lkr,mmk,mxn,myr,ngn,nok,nzd,php,pkr,pln,rub,sar,sek,sgd,thb,try,twd,uah,vef,vnd,zar,xdr,xag,xau,bits,sats",
		);
		params.append("precision", "full");

		const response = await this.#request.get(
			`/simple/token_price/${chain}?` + params,
		);

		if (!response.ok)
			throw new HttpError(response.status, await response.text());

		const data = await parseSchemaFromResponse<z.infer<typeof tokenPriceSchema>>(
			tokenPriceSchema,
			response,
		);

		return Object.keys(data).map((key) => data[key] as CoinPrice);
	}

	async coin(props: GetCoinByIDProps): Promise<Coin | null> {
		const params = new URLSearchParams();

		if (props.include) {
			const {
				sparkline,
				community_data,
				developer_data,
				localization,
				market_data,
				tickers,
			} = props.include;
			if (sparkline) params.append("sparkline", String(sparkline));
			if (community_data)
				params.append("community_data", String(community_data));
			if (developer_data)
				params.append("developer_data", String(developer_data));
			if (localization) params.append("localization", String(localization));
			if (market_data) params.append("market_data", String(market_data));
			if (tickers) params.append("tickers", String(tickers));
		}

		const response = await this.#request.get(
			`/coins/${props.coin_id}?` + params,
		);

		if (response.status === 404) return null;

		if (!response.ok)
			throw new HttpError(response.status, await response.text());

		return (await response.json()) as Coin;
	}

	async list(props?: ListCoinsProps): Promise<BaseCoin[]> {
		const params = new URLSearchParams();
		if (props && props.include) {
			const { platform } = props.include;

			if (platform)
				params.append("include_platform", String(props.include.platform));
		}

		const response = await this.#request.get("/coins/list?" + params);

		if (!response.ok)
			throw new HttpError(response.status, await response.text());

		const data = await parseSchemaFromResponse<z.infer<typeof coinsSchema>>(
			coinsSchema,
			response,
		);

		return data.map((coin) => new BaseCoin(coin));
	}

	async markets({
		vs_currency,
		include,
		per_page = 100,
		page = 1,
	}: ListMarketsProps): Promise<CoinMarket[]> {
		const params = new URLSearchParams();
		params.append("vs_currency", vs_currency);

		if (include) {
			const { price_change_percentage, sparkline } = include;

			if (sparkline) params.append("sparkline", String(sparkline));

			if (price_change_percentage)
				params.append(
					"price_change_percentage",
					price_change_percentage.join(","),
				);

			params.append("per_page", String(per_page));
			params.append("page", String(page));
		}

		const response = await this.#request.get("/coins/markets?" + params);

		if (response.status == 404) throw new CoinNotFoundError(vs_currency);

		if (!response.ok)
			throw new HttpError(response.status, await response.text());

		const data = await parseSchemaFromResponse<z.infer<typeof coinMarketsSchema>>(
			coinMarketsSchema,
			response,
		);

		return data.map(CoinMarketMapper.toCoinMarket);
	}

	async tickers({
		coin_id,
		include,
	}: GetTickersProps): Promise<Ticker[] | null> {
		const params = new URLSearchParams();

		if (include) {
			const { depth, include_exchange_logo } = include;
			if (depth) params.append("depth", String(depth));

			if (include_exchange_logo)
				params.append("include_exchange_logo", String(include_exchange_logo));
		}

		const response = await this.#request.get(
			`/coins/${coin_id}/tickers?` + params,
		);

		if (response.status === 404) return null;

		if (!response.ok)
			throw new HttpError(response.status, await response.text());

		const data = await parseSchemaFromResponse<z.infer<typeof tickersSchema>>(
			tickersSchema,
			response,
		);

		return data.tickers;
	}

	async marketChart({
		coin_id,
		days,
		vs_currency,
		interval,
	}: GetCoinMarketChartProps) {
		const params = new URLSearchParams();

		params.append("coin_id", coin_id);
		params.append("vs_currency", vs_currency);
		params.append("days", String(days));
		if (interval) params.append("interval", interval);

		const response = await this.#request.get(
			`/coins/${coin_id}/market_chart?` + params,
		);

		if (response.status === 404) throw new CoinNotFoundError(coin_id);

		if (!response.ok)
			throw new HttpError(response.status, await response.text());

		const data = await parseSchemaFromResponse<z.infer<typeof marketChartSchema>>(
			marketChartSchema,
			response,
		);

		return MarketChartMapper.toMarketChart(data);
	}

	async history({
		coin_id,
		date,
		localization = true,
	}: GetCoinHistoryProps): Promise<Coin | null> {
		const params = new URLSearchParams();

		params.append("date", date);
		params.append("localization", String(localization));

		const response = await this.#request.get(
			`/coins/${coin_id}/history?` + params,
		);

		if (response.status === 404) return null;

		if (!response.ok)
			throw new HttpError(response.status, await response.text());

		return (await response.json()) as Coin;
	}
}
