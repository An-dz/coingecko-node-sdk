import { beforeEach, describe, it, expect, beforeAll } from "vitest";
import { ContractsManager } from "../src/managers/ContractsManager.js";
import { GeckoRequestManager } from "../src/managers/GeckoRequestManager.js";
import { env } from "./env.js";
import { mockDataPath } from "./mockDataPath.js";
import nock from "nock";

let requestManager: GeckoRequestManager;
let contractsManager: ContractsManager;
describe("ContractsManager", async () => {
  beforeAll(() => {
    if (!env.MOCK_API_CALLS) return;

    const scope = nock("https://api.coingecko.com/api/v3")
      .get(
        "/coins/polygon-pos/contract/0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39"
      )
      .replyWithFile(200, mockDataPath("coin_binance_contract.json"));
  });

  beforeEach(() => {
    requestManager = new GeckoRequestManager({
      baseURL: "https://api.coingecko.com/api/v3",
      timeoutMS: 30 * 1000,
      autoRetry: true,
    });
    contractsManager = new ContractsManager({ requestManager });
  });

  it("should return a coin by contract", async () => {
    const coin = await contractsManager.coinByContract(
      "polygon-pos",
      "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39"
    );

    expect(coin).not.toBe(null);
    expect(coin?.id).toBe("binance-usd");
  });
});
