import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

declare const process: {
  env: Record<string, string | undefined>;
};

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  server: {
    MOCK_API_CALLS: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
  },
  client: {},
  runtimeEnv: process.env,
});
