import { describe, it, expect, beforeEach } from "vitest";
import { getEnv, _clearEnvCache } from "@/lib/env";

function setEnv(vars: Record<string, string | undefined>) {
  _clearEnvCache();
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete (process.env as Record<string, string | undefined>)[k];
    else process.env[k] = v;
  }
}

describe("env validation", () => {
  beforeEach(() => {
    _clearEnvCache();
  });

  it("parses valid env", () => {
    setEnv({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      AUTH_SECRET: "secret123",
      OPENROUTER_API_KEY: "sk-or-123",
    });
    const env = getEnv();
    expect(env.DATABASE_URL).toContain("postgresql://");
  });

  it("throws when DATABASE_URL missing", () => {
    setEnv({
      DATABASE_URL: undefined,
      AUTH_SECRET: "secret123",
      OPENROUTER_API_KEY: "sk-or-123",
    });
    expect(() => getEnv()).toThrow(/DATABASE_URL/);
  });

  it("throws when OPENROUTER_API_KEY missing", () => {
    setEnv({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      AUTH_SECRET: "secret123",
      OPENROUTER_API_KEY: undefined,
    });
    expect(() => getEnv()).toThrow(/OPENROUTER_API_KEY/);
  });

  it("throws when DATABASE_URL has invalid format", () => {
    setEnv({
      DATABASE_URL: "mysql://user:pass@localhost:5432/db",
      AUTH_SECRET: "secret123",
      OPENROUTER_API_KEY: "sk-or-123",
    });
    expect(() => getEnv()).toThrow(/must start with postgresql:\/\//);
  });
});
