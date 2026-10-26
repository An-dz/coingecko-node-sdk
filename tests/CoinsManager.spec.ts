import nock from "nock";
import { beforeEach, describe, it, expect, beforeAll } from "vitest";
import { CoinsManager } from "../src/managers/CoinsManager.js";
import { GeckoRequestManager } from "../src/managers/GeckoRequestManager.js";
import { env } from "./env.js";
import { mockDataPath } from "./mockDataPath.js";

let requestManager: GeckoRequestManager;
let coinsManager: CoinsManager;
const coinsId = ["bitcoin", "ethereum", "dogecoin"];
describe("CoinsManager", () => {
  beforeAll(async () => {
    if (env.MOCK_API_CALLS) {
      const scope = nock("https://api.coingecko.com/api/v3")
        .get(/\/coins\/list/i)
        .replyWithFile(200, mockDataPath("coins.json"), {
          "Content-Type": "application/json",
        })
        .get(/\/coins\/markets/i)
        .replyWithFile(200, mockDataPath("market_coins.json"), {
          "Content-Type": "application/json",
        })
        .get(/\/coins\/bitcoin\/tickers/i)
        .replyWithFile(200, mockDataPath("tickers.json"), {
          "Content-Type": "application/json",
        })
        .get(/\/coins\/bitcoin\/market_chart/i)
        .replyWithFile(200, mockDataPath("chart_bitcoin.json"));

      for (const coinId of coinsId) {
        scope
          .get(new RegExp("/coins/COIN_HERE".replace("COIN_HERE", coinId), "i"))
          .replyWithFile(200, mockDataPath(`coin_${coinId}.json`), {
            "Content-Type": "application/json",
          });
      }
    }
  });

  beforeEach(() => {
    requestManager = new GeckoRequestManager({
      baseURL: "https://api.coingecko.com/api/v3",
      timeoutMS: 30 * 1000,
      autoRetry: true,
    });
    coinsManager = new CoinsManager({ requestManager });
  });

  it("should be able to list all coins", async () => {
    const coins = await coinsManager.list({
      include: {
        platform: true,
      },
    });

    expect(coins.length).toBeGreaterThan(10);
  });

  it("should be able to list coin markets", async () => {
    const coinMarkets = await coinsManager.markets({
      vs_currency: "usd",
      per_page: 250,
      include: {
        sparkline: true,
        price_change_percentage: [],
      },
    });

    expect(coinMarkets.length).toBeGreaterThan(1);
  });

  it("should be able list tickers from bitcoin", async () => {
    const tickers = await coinsManager.tickers({
      coin_id: "bitcoin",
    });

    expect(tickers?.length).toBeGreaterThan(1);
  });

  it("should be able to fetch specific coin by id", async () => {
    for (const coinId of coinsId) {
      const coin = await coinsManager.coin({
        coin_id: coinId,
      });

      expect(coin?.id).toBe(coinId);
    }
  });

  it("should be able to fetch market chart data", async () => {
    const marketChartData = await coinsManager.marketChart({
      coin_id: "bitcoin",
      vs_currency: "usd",
      days: 1,
    });

    expect(marketChartData.marketCapSnapshots.length).toBeGreaterThan(1);
    expect(marketChartData.priceSnapshots.length).toBeGreaterThan(1);
    expect(marketChartData.volumeSnapshots.length).toBeGreaterThan(1);
  });
});
