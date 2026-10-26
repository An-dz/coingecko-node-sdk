import { z } from "zod";
import { CoinMarket } from "../../index.js";
import { coinMarketSchema } from "../validators/CoinsManager.validator.js";

export class CoinMarketMapper {
  static toCoinMarket(props: z.infer<typeof coinMarketSchema>): CoinMarket {
    const {
      sparkline_in_7d,
      price_change_percentage_24h_in_currency,
      price_change_percentage_30d_in_currency,
      price_change_percentage_7d_in_currency,
      price_change_percentage_14d_in_currency,
      price_change_percentage_1y_in_currency,
      price_change_percentage_1h_in_currency,
      price_change_percentage_200d_in_currency,
    } = props;

    return new CoinMarket({
      ...props,
      sparkline_in_7d: sparkline_in_7d ?? null,
      price_change_percentage_24h_in_currency:
        price_change_percentage_24h_in_currency ?? null,
      price_change_percentage_30d_in_currency:
        price_change_percentage_30d_in_currency ?? null,
      price_change_percentage_7d_in_currency:
        price_change_percentage_7d_in_currency ?? null,
      price_change_percentage_1h_in_currency:
        price_change_percentage_1h_in_currency ?? null,
      price_change_percentage_14d_in_currency:
        price_change_percentage_14d_in_currency ?? null,
      price_change_percentage_200d_in_currency:
        price_change_percentage_200d_in_currency ?? null,
      price_change_percentage_1y_in_currency:
        price_change_percentage_1y_in_currency ?? null,
    });
  }
}
