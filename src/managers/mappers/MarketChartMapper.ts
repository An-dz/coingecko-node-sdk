import { z } from "zod";
import {
  MarketChartSnapshot,
  MarketChartSnapshots,
} from "../../structures/MarketChartSnapshot.js";
import { marketChartSchema } from "../validators/CoinsManager.validator.js";

export class MarketChartMapper {
  static toMarketChart({
    market_caps,
    prices,
    total_volumes,
  }: z.infer<typeof marketChartSchema>) {
    return new MarketChartSnapshots({
      marketCapSnapshots: market_caps.map(this.#snapshotMapper),
      priceSnapshots: prices.map(this.#snapshotMapper),
      volumeSnapshots: total_volumes.map(this.#snapshotMapper),
    });
  }

  static #snapshotMapper = (
    snapshot: [string, string | null]
  ): MarketChartSnapshot => {
    return {
      date: new Date(snapshot[0]),
      value: snapshot[1],
    };
  };
}
